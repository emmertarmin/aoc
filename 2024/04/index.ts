import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

function amountInLine(line: string, word: string) {
	const searchStrings = [word, word.split('').reverse().join('')]
	let amount = 0
	for (const search of searchStrings) {
		let i = 0
		while (i < line.length) {
			const test = line.split('').splice(i, search.length)
			if (test.join('') === search) {
				amount++
			}
			i++
		}

	}
	// console.log(line, amount)
	return amount
}

function applyFilter(grid: string[][], filter: number[][]) {
	let results = []
	for (let x = 0; x < grid.length - filter.length + 1; x++) {
		for (let y = 0; y < grid[0].length - filter[0].length + 1; y++) {
			const subgrid = filter.map((row, i) => row.map((_, j) => grid[x + i][y + j]))
			let result: string[] = []
			for (let i = 0; i < subgrid.length; i++) {
				for (let j = 0; j < subgrid[0].length; j++) {
					if (filter[i][j]) result.push(subgrid[i][j])
				}
			}
			results.push(result)
		}
	}
	return results
}

// const testGrid = [
// 	['A', 'B', 'C'],
// 	['D', 'E', 'F'],
// 	['G', 'H', 'I']
// ]

// test('applyFilter 1', () => {
// 	const result = applyFilter(testGrid, [[1]])
// 	expect(result).toEqual([
// 		['A'], ['B'], ['C'], ['D'], ['E'], ['F'], ['G'], ['H'], ['I']
// 	])
// })

// test('applyFilter 2', () => {
// 	const result = applyFilter(testGrid, [[1], [1], [1]])
// 	expect(result).toEqual([
// 		['A', 'D', 'G'],
// 		['B', 'E', 'H'],
// 		['C', 'F', 'I']
// 	])
// })

// test('applyFilter 3', () => {
// 	const result = applyFilter(testGrid, [[1, 1, 1]])
// 	expect(result).toEqual([
// 		['A', 'B', 'C'],
// 		['D', 'E', 'F'],
// 		['G', 'H', 'I']
// 	])
// })

async function solve(lines: string[]) {
	const searchTerm = 'XMAS'
	let sum = 0

	let grid = lines.map(line => line.split(''));

	let filter: number[][]

	// rows
	filter = searchTerm.split('').map((_, i) => [1])
	sum += applyFilter(grid, filter).reduce((acc, curr) => acc + amountInLine(curr.join(''), searchTerm), 0)

	// cols
	filter = [searchTerm.split('').map((_, i) => 1)]
	sum += applyFilter(grid, filter).reduce((acc, curr) => acc + amountInLine(curr.join(''), searchTerm), 0)

	// diagonals 1
	filter = searchTerm.split('').map((_, i) => searchTerm.split('').map((_, j) => i === j ? 1 : 0))
	sum += applyFilter(grid, filter).reduce((acc, curr) => acc + amountInLine(curr.join(''), searchTerm), 0)

	// diagonals 2
	filter = searchTerm.split('').map((_, i) => searchTerm.split('').map((_, j) => searchTerm.split('').length === i + j + 1 ? 1 : 0))
	sum += applyFilter(grid, filter).reduce((acc, curr) => acc + amountInLine(curr.join(''), searchTerm), 0)

	return sum
}

async function solveB(lines: string[]) {
	let sum = 0

	let grid = lines.map(line => line.split(''));

	const searchTerm = 'MAS'

	const searchFilters = [
		[
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		],
		[
			[0, 0, 1],
			[0, 1, 0],
			[1, 0, 0]
		]
	]

	for (let x = 0; x < grid.length - searchTerm.length + 1; x++) {
		for (let y = 0; y < grid[0].length - searchTerm.length + 1; y++) {
			const subgrid = searchTerm.split('').map((row, i) => searchTerm.split('').map((_, j) => grid[x + i][y + j]))

			let results = []
			for (const filter of searchFilters) {
				let result: string[] = []
				for (let i = 0; i < subgrid.length; i++) {
					for (let j = 0; j < subgrid[0].length; j++) {
						if (filter[i][j]) result.push(subgrid[i][j])
					}
				}
				results.push(result)
			}
			results = results.map(result => result.join(''))
			if (results.every(result => amountInLine(result, searchTerm) === 1)) {
				sum++
			}
		}
	}

	return sum
}

describe(`test`, async () => {
	const lines  = await getLines(`${import.meta.dir}/test1.txt`) as string[]

	test('answer 1', async () => {
		const answer = await solve(lines)
		expect(answer).toBe(18);
	})

	const linesB  = await getLines(`${import.meta.dir}/test2.txt`) as string[]

	test('answer 2', async () => {
		const answer = await solveB(linesB)
		expect(answer).toBe(9);
	})
})

describe(`prod`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	test('answer 1', async () => {
		const answer = await solve(lines)
		expect(answer).toBeGreaterThan(2316);
		expect(answer).toBe(2397);
	})

	test('answer 2', async () => {
		const answer = await solveB(lines)
		expect(answer).toBe(1824);
	})
})
