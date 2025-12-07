// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

type Grid = string[][]

const rot = (vec: { x: number, y: number }) => ({ x: vec.y != 0 ? -vec.y : 0, y: vec.x })
const isInBounds = (grid: Grid, pos: { x: number, y: number }) => pos.y >= 0 && pos.y < grid.length && pos.x >= 0 && pos.x < grid[0].length

async function solve(lines: string[]) {
	let visited = new Set<string>()
	let dir = { x: 0, y: -1 }
	let pos = { x: 0, y: 0 }
	const grid = []

	for (const line of lines) {
		grid.push(line.split('').map(c => c === '^' ? '.' : c))
		if (line.includes('^')) {
			pos = { x: line.indexOf('^'), y: grid.length - 1 }
		}
	}

	while (true) {
		const key = `${pos.x},${pos.y}`
		visited.add(key)

		let next = { x: pos.x + dir.x, y: pos.y + dir.y }
		while (grid[next.y]?.[next.x] === '#') {
			dir = rot(dir)
			next = { x: pos.x + dir.x, y: pos.y + dir.y }
		}
		if (!isInBounds(grid, next)) break
		pos = next
	}
	return visited
}

async function solveB(lines: string[]) {
	let startingPos = { x: 0, y: 0 }
	const grid = []

	let sum = 0

	for (const line of lines) {
		grid.push(line.split('').map(c => c === '^' ? '.' : c))
		if (line.includes('^')) {
			startingPos = { x: line.indexOf('^'), y: grid.length - 1 }
		}
	}

	const relevant = await solve(lines)

	for (let [x, y] of relevant.values().map(s => s.split(',').map(Number))) {
		// if (grid[y][x] === '#') continue
		if (x === startingPos.x && y === startingPos.y) continue

		const testGrid = structuredClone(grid) as Grid
		testGrid[y][x] = '#'

		let dir = { x: 0, y: -1 }
		let pos = structuredClone(startingPos)

		const visited = new Set<string>()

		while (true) {
			const key = `${pos.x},${pos.y},${dir.x + 10*dir.y}`
			if (visited.has(key)) {
				sum++
				// console.log('found', key, visited.size)
				break
			}
			visited.add(key)

			let next = { x: pos.x + dir.x, y: pos.y + dir.y }
			while (testGrid[next.y]?.[next.x] === '#') {
				dir = rot(dir)
				next = { x: pos.x + dir.x, y: pos.y + dir.y }
			}
			if (!isInBounds(grid, next)) break
			pos = next
		}
	}
	return sum
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer.size).toBe(41)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer.size).toBe(4776)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solveB(linesTest)
			expect(answer).toBe(6)
		}, 10 * 60 * 1000)

		test('PROD', async () => {
			const answer = await solveB(linesProd)
			expect(answer).toBeGreaterThan(1484)
			expect(answer).toBe(1586)
		}, 10 * 60 * 1000)
	})
})
