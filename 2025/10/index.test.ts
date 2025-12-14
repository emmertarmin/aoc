import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

function flip(ist: string, positions: number[]): string {
	const istArr = ist.split('')
	for (const pos of positions) {
		istArr[pos] = istArr[pos] === '#' ? '.' : '#'
	}
	return istArr.join('')
}

async function solve(lines: string[]) {
	const machines = []

	for (const line of lines) {
		const matches = line.match(/\[(?<soll>[#\.]+)\] (?<buttons>[\(\)\d\s,]+) \{(?<jolts>[\d,]+)\}/)
		machines.push({
			soll: matches.groups.soll,
			buttons: matches.groups.buttons.split(' ').map(s => s.match(/\(([^\)]+)\)/)[1].split(',').map(Number)),
			// jolts: matches.groups.jolts.split(',').map(Number),
		})
	}

	// generate all button press combinations
	function rec(arr: any[], n: number, acc: any[] = []) {
		if (acc.length === n) {
			return [acc]
		}

		return arr.slice(0, arr.length - (n - acc.length) + 1).reduce((prev, a, i) => {
			return [...prev, ...rec(arr.slice(i + 1), n, acc.concat([a]))]
		}, [])
	}

	//n try all combinations of button presses, and the earliest success is automatically the most efficient
	const answers = machines.map((machine, i) => {
		for (let n = 0; n <= machine.buttons.length; n++) {
			const btnsToPress = rec(machine.buttons.map((_, j) => j), n, [])
			for (const btns of btnsToPress) {
				let ist = new Array(machine.soll.length).fill('.').join('')
				for (const btn of btns) {
					ist = flip(ist, machine.buttons[btn])
				}
				if (ist === machine.soll) {
					return n
				}
			}
		}
	})

	return answers.reduce((a, b) => a + b, 0)
}

async function solveB(lines: string[]) {
	const machines = []

	for (const line of lines) {
		const matches = line.match(/\[(?<soll>[#\.]+)\] (?<buttons>[\(\)\d\s,]+) \{(?<jolts>[\d,]+)\}/)
		machines.push({
			soll: matches.groups.jolts.split(',').map(Number).map(n => n%2 ? '.' : '#').join(''),
			buttons: matches.groups.buttons
				.split(' ')
				.map(s => s.match(/\(([^\)]+)\)/)[1].split(',').map(Number))
				.toSorted((a, b) => b.length - a.length)
				.map(arr => new Array(matches.groups.soll.length).fill(0).map((_, i) => arr.includes(i) ? 1 : 0)),
			jolts: matches.groups.jolts.split(',').map(Number),
		})
	}

	const answers = machines.map((machine, i) => {
		let min = Infinity
		let found = false

		function rec(btns: number[] = [], ist: number[], soll: number[], acc: number[]) {
			if (found) return

			if (ist.every((v, i) => v === soll[i])) {
				if (acc.length < min) {
					console.log('FOUND', acc.join(','), 'length', acc.length, soll, ist)
					min = acc.length
					found = true
				}
				return
			}

			if (ist.some((v, i) => v > soll[i])) {
				return
			}

			if (found) return

			btns.forEach((_, i) => {
				// console.log('try btn', btns[i], 'ist', ist)
				const newIst = ist.map((v, j) => v + btns[i][j])
				rec(btns, newIst, soll, acc.concat([i]))
			})
		}

		rec(machine.buttons, new Array(machine.soll.length).fill(0), machine.jolts, [])

		return min
	})

	return answers.reduce((a, b) => a + b, 0)
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(7)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(524)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solveB(linesTest)
			expect(answer).toBe(33)
		})

		// test('PROD', async () => {
		// 	const answer = await solveB(linesProd)
		// 	expect(answer).toBe(0)
		// })
	})
})
