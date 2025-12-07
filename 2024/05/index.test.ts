import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

function checkOrder(pageList: number[], rules: { a: number, b: number }[]) {
	for (const rule of rules) {
		const posA = pageList.indexOf(rule.a)
		const posB = pageList.indexOf(rule.b)
		if (posA >= 0 && posB >= 0 && posA > posB) {
			return false
		}
	}
	return true
}

async function solve(lines: string[]) {
	let sum = 0

	const rules = []
	const pageLists = []

	for (const line of lines) {
		if (line.match(/^\d+\|\d+$/)) {
			const [a, b] = line.split('|').map(Number)
			rules.push({ a, b })
		}
		if (line.match(/^[\d,]+$/)) {
			const pageList = line.split(',').map(Number)
			pageLists.push(pageList)
		}
	}

	for (const pageList of pageLists) {
		let valid = checkOrder(pageList, rules)
		if (valid) {
			const middle = pageList[Math.floor(pageList.length / 2)]
			sum += middle
		}
	}

	return sum
}

async function solveB(lines: string[]) {
	let sum = 0

	const rules = []
	const pageLists = []

	for (const line of lines) {
		if (line.match(/^\d+\|\d+$/)) {
			const [a, b] = line.split('|').map(Number)
			rules.push({ a, b })
		}
		if (line.match(/^[\d,]+$/)) {
			const pageList = line.split(',').map(Number)
			pageLists.push(pageList)
		}
	}

	const invalids = []

	for (const pageList of pageLists) {
		if (!checkOrder(pageList, rules)) {
			invalids.push(pageList)
		}
	}

	const begin = new Date().getTime()
	let counter = 0
	for (const pageList of invalids) {
		let invocation = 0
		function rec(list: number[], items: number[]) {
			invocation++
			// stop condition
			if (items.length === 0) {
				return checkOrder(list, rules) ? list : null
			}
			// otherwise
			const nextLists = Array
				.from(Array(list.length + 1).keys())
				.map((_, i) => {
					const copy = [...list]
					copy.splice(i, 0, items[0])
					return copy
				})
				.filter(list => checkOrder(list, rules))
				.map(list => rec(list, items.slice(1)))
				.reduce((acc, curr) => {
					// remove duplicates
					if (acc.find(a => a.join(',') === curr.join(','))) {
						return acc
					}
					return [...acc, curr]
				}, [] as number[][])
			return nextLists.find(Boolean)
		}
		const ordered = rec([], [...pageList])
		// console.log('invocation', invocation)

		const end = new Date().getTime()
		// console.log("duration", Math.round((end - begin)/1000/6)/10, 'minutes', `${counter}/${invalids.length}`)
		const middle = ordered[Math.floor(ordered.length / 2)]
		sum += middle
		counter++
	}

	return sum
}

describe('2024/05', async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(143)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(5208)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solveB(linesTest)
			expect(answer).toBe(123)
		})

		test('PROD', async () => {
			const answer = await solveB(linesProd)
			expect(answer).toBe(6732)
		})
	})
})
