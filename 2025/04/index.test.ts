// @ts-ignore: bun-test-ignore-file
import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

type Cell = '@' | '.'

function draw(grid: Cell[][]) {
	for (const row of grid) {
		console.log(row.join(''))
	}
}

function getNeighbors(x: number, y: number, grid: Cell[][]) {
	const deltas = [
		[-1, -1], [0, -1], [1, -1],
		[-1, 0],           [1, 0],
		[-1, 1],  [0, 1],  [1, 1],
	]

	const neighbors: Cell[] = []
	for (const [dx, dy] of deltas) {
		const nx = x + dx
		const ny = y + dy
		if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length) {
			neighbors.push(grid[ny][nx])
		}
	}
	return neighbors
}

function gridSum(grid: Cell[][], value: Cell) {
	let sum = 0
	for (const row of grid) {
		for (const cell of row) {
			if (cell === value) sum++
		}
	}
	return sum
}

async function solve(lines: Cell[], iter = false) {
	const grid: Cell[][] = []

	for (const line of lines) {
		grid.push(line.split('') as Cell[])
	}

	// draw(grid)

	let sum = 0

	let changed = true
	while (changed) {
		changed = false
		let eligible: [number, number][] = []

		// First pass: find eligible cells to change
		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[0].length; x++) {
				const cell = grid[y][x]
				const neighbors = getNeighbors(x, y, grid)
				if (cell !== '@') continue
				if (neighbors.filter(n => n === '@').length < 4) {
					eligible.push([x, y])
				}
			}
		}

		for (const [x, y] of eligible) {
			grid[y][x] = '.'
			changed = true
			sum++
		}

		if (!iter) break
	}

	return sum
}

describe(`2025/04`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as Cell[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as Cell[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(13)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(1419)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, true)
			expect(answer).toBe(43)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, true)
			expect(answer).toBe(8739)
		})
	})
})
