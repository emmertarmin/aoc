// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

type V = { x: number, y: number }
type Node = V & { dx: number, dy: number }
type Cell = Node & { g: number, h: number, parents: Node[] | null }

let begin = Date.now()
function log(...args: any[]) {
	const now = Date.now()
	console.log(`${now - begin}ms:`, ...args)
	begin = now
}

async function solve(lines: string[], part2 = false) {
	const grid: string[][] = []
	const start = { x: undefined, y: undefined }
	const end = { x: undefined, y: undefined }

	for (const line of lines) {
		if (line.includes('S')) {
			start.x = line.indexOf('S')
			start.y = grid.length
		}
		if (line.includes('E')) {
			end.x = line.indexOf('E')
			end.y = grid.length
		}
		grid.push(line.split(''))
	}

	function isOutOfBounds(v: V) {
		return v.x < 0 || v.y < 0 || v.x >= grid[0].length || v.y >= grid.length
	}

	function isWall(v: V) {
		return grid[v.y][v.x] === '#'
	}

	// const cells = new Map<string, Cell>()

	function findPath(startNode: Node, endNode: V) {
		const openQueue = new Map<string, Cell>()
		const closedQueue = new Map<string, Cell>()
		openQueue.set(`${startNode.x},${startNode.y},${startNode.dx},${startNode.dy}`, {
			x: startNode.x,
			y: startNode.y,
			dx: startNode.dx,
			dy: startNode.dy,
			g: 0,
			h: 0,
			parents: [{
				x: startNode.x - startNode.dx,
				y: startNode.y - startNode.dy,
				dx: startNode.dx,
				dy: startNode.dy
			}]
		})

		const maxLen = grid.length * grid[0].length * 4

		while (openQueue.size > 0) {
			if (closedQueue.size > maxLen) {
				throw new Error('Max length reached')
				break
			}
			const current = Array.from(openQueue.values()).sort((a, b) => a.g + a.h - b.g - b.h)[0]
			openQueue.delete(`${current.x},${current.y},${current.dx},${current.dy}`)
			closedQueue.set(`${current.x},${current.y},${current.dx},${current.dy}`, current)

			// if (current.x === endNode.x && current.y === endNode.y) {
			// 	// DONE
			// 	break
			// }

			const neighbors = [
				{ x: current.x + current.dx, y: current.y + current.dy, dx: current.dx, dy: current.dy, cost: 1 },
				{ x: current.x, y: current.y, dx: current.dy, dy: -1 * current.dx, cost: 1000 },
				{ x: current.x, y: current.y, dx: -1 * current.dy, dy: current.dx, cost: 1000 }
			]

			for (const neighbor of neighbors) {
				if (isOutOfBounds(neighbor) || isWall(neighbor)) {
					continue
				}

				const g = current.g + neighbor.cost
				let h = Math.abs(neighbor.x - endNode.x) + Math.abs(neighbor.y - endNode.y)

				const existing = closedQueue.get(`${neighbor.x},${neighbor.y},${neighbor.dx},${neighbor.dy}`)
				if (existing) {
					if (g < existing.g) {
						existing.g = g
						existing.h = h
					}
					if (g === existing.g) {
						existing.parents.push({ x: current.x, y: current.y, dx: current.dx, dy: current.dy })
					}
				} else {
					const cell = {
						x: neighbor.x,
						y: neighbor.y,
						dx: neighbor.dx,
						dy: neighbor.dy,
						g,
						h,
						parents: [{ x: current.x, y: current.y, dx: current.dx, dy: current.dy }]
					}
					openQueue.set(`${neighbor.x},${neighbor.y},${neighbor.dx},${neighbor.dy}`, cell)
				}
			}
		}

		return Array.from(closedQueue.values())
	}

	const cells = findPath({ ...start, dx: 1, dy: 0 }, { ...end})

	const minCost = cells
		.filter((cell) => cell.x === end.x && cell.y === end.y)
		.map((cell) => cell.g)
		.reduce((acc, g) => Math.min(acc, g), Infinity)

	if (!part2) {
		return minCost
	}

	const onPath = new Set<string>()

	const queue = cells.filter((cell) => cell.x === end.x && cell.y === end.y && cell.g === minCost)
	while (queue.length > 0) {
		const current = queue.shift()
		const key = `${current.x},${current.y}`
		onPath.add(key)
		current.parents.forEach((parent) => {
			if (parent.x && parent.y) {
				queue.push(cells.find((cell) => cell.x === parent.x && cell.y === parent.y && cell.dx === parent.dx && cell.dy === parent.dy))
			}
		})
	}

	return onPath.size
}

describe('2024/16', async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesTest2 = await getLines(`${import.meta.dir}/test2.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(7036)
		})

		test('TEST', async () => {
			const answer = await solve(linesTest2)
			expect(answer).toBe(11048)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(135512)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, true)
			expect(answer).toBe(45)
		})


		test('TEST', async () => {
			const answer = await solve(linesTest2, true)
			expect(answer).toBe(64)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, true)
			expect(answer).toBe(541)
		})
	})
})
