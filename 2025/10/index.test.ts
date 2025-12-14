import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

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

	function flip(ist: string, positions: number[]): string {
		const istArr = ist.split('')
		for (const pos of positions) {
			istArr[pos] = istArr[pos] === '#' ? '.' : '#'
		}
		return istArr.join('')
	}

	function rec(arr: any[], n: number, acc: any[] = []) {
		if (acc.length === n) {
			return [acc]
		}

		return arr.slice(0, arr.length - (n - acc.length) + 1).reduce((prev, a, i) => {
			return [...prev, ...rec(arr.slice(i + 1), n, acc.concat([a]))]
		}, [])
	}

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
			expect(answer).toBe(0)
		})
	})

	describe('PART 2', async () => {
		// test('TEST', async () => {
		// 	const answer = await solve(linesTest)
		// 	expect(answer).toBe(0)
		// })

		// test('PROD', async () => {
		// 	const answer = await solve(linesProd)
		// 	expect(answer).toBe(0)
		// })
	})
})
