// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

type V = { x: number, y: number }
type Cell = V & { g: number, h: number, debug?: any, parents: string[] | null }

async function solve(lines: string[], part2 = false) {
	const grid: string[][] = []
	const start = { x: undefined, y: undefined }
	const end = { x: undefined, y: undefined }

	let y = 0
	for (const line of lines) {
		if (line.includes('S')) {
			start.x = line.indexOf('S')
			start.y = y
		}
		if (line.includes('E')) {
			end.x = line.indexOf('E')
			end.y = y
		}
		grid.push(line.split(''))
		y++
	}

	function isOutOfBounds(v: V) {
		return v.x < 0 || v.y < 0 || v.x >= grid[0].length || v.y >= grid.length
	}

	function isWall(v: V) {
		return grid[v.y][v.x] === '#'
	}

	const openQueue: Cell[] = [{ x: start.x, y: start.y, g: 0, h: 0, parents: [`${start.x - 1},${start.y}`] }]
	const closedQueue: Cell[] = []

	while (openQueue.length > 0) {
		const current = openQueue.shift()
		closedQueue.push(current)

		if (current.x === end.x && current.y === end.y) {
			console.log('DONE')
			break
		}

		current.parents.forEach((parent) => {
			const [px, py] = parent.split(',').map(Number)

			const dir = { x: current.x - px, y: current.y - py }

			const neighbors = [
				{ x: current.x + dir.x, y: current.y + dir.y, cost: 1 },
				{ x: current.x - dir.y, y: current.y + dir.x, cost: 1001 },
				{ x: current.x + dir.y, y: current.y - dir.x, cost: 1001 }
			]

			for (const neighbor of neighbors) {
				if (isOutOfBounds(neighbor) || isWall(neighbor)) {
					continue
				}

				const g = current.g + neighbor.cost
				let h = Math.abs(neighbor.x - end.x) + Math.abs(neighbor.y - end.y)
				if (neighbor.x !== end.x) { h += 1000 }
				if (neighbor.y !== end.y) { h += 1000 }

				const existing = openQueue.find((cell) => cell.x === neighbor.x && cell.y === neighbor.y)
				if (existing) {
					if (g < existing.g) {
						existing.g = g
						existing.h = h
					}
					// if (g === existing.g && !existing.parents.includes(`${current.x},${current.y}`)) {
					// 	existing.parents.push(`${current.x},${current.y}`)
					// 	console.log('PUSH', g, existing.parents)
					// }
				} else {
					const cell = { x: neighbor.x, y: neighbor.y, g, h, parents: [`${current.x},${current.y}`] }
					openQueue.push(cell)
				}
			}

			openQueue.sort((a, b) => a.g + a.h - b.g - b.h)
		})
	}

	if (part2) {
		let sum = 0
	// 	function rec({x, y}: V, h: number): number[][] {
	// 		const nb = [[-1, 0], [0, 1], [1, 0], [0, -1]]
	// 			.map(([dy, dx]) => [y + dy, x + dx])
	// 			.filter(([ny, nx]) => !isOutOfBounds({x: nx, y: ny}))
	// 			.filter(([ny, nx]) => grid[ny][nx] !== '#')

	// 		if (x === end.x && y === end.y) {
	// 			return nb.filter(([ny, nx]) => grid[ny][nx] === 'E')
	// 		}

	// 		return nb.reduce((acc, [ny, nx]) => [...acc, ...rec({x: nx, y: ny}, h + 1)], [])
	// 	}

	// 	[start].forEach(({x, y}) => {
	// 		sum += rec({x, y}, 0).length
	// 	})

		return sum
	}

	return closedQueue.find((cell) => cell.x === end.x && cell.y === end.y).g
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesTest2 = await getLines(`${import.meta.dir}/test2.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test.only('TEST 1', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(7036)
		})

		test.only('TEST 2', async () => {
			const answer = await solve(linesTest2)
			expect(answer).toBe(11048)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(135512)
		})
	})

	describe('PART 2', async () => {
		test.only('TEST 1', async () => {
			const answer = await solve(linesTest, true)
			expect(answer).toBe(45)
		})


		test('TEST 2', async () => {
			const answer = await solve(linesTest2, true)
			expect(answer).toBe(64)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, true)
			expect(answer).toBe(0)
		})
	})
})
