// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

type V = { x: number, y: number }
type Cell = V & { g: number, h: number, parent: V | null }

async function solve(lines: string[], maxRange = 2, cutoff = 100) {
	const grid: string[][] = []
	const start: V = { x: null, y: null }
	const end: V = { x: null, y: null }

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

	function findPath(startNode: V, endNode: V) {
		const openQueue = new Map<string, Cell>()
		const closedQueue = new Map<string, Cell>()
		openQueue.set(`${startNode.x},${startNode.y}`, {
			x: startNode.x,
			y: startNode.y,
			g: 0,
			h: 0,
			parent: null
		})

		let foundPath = false
		while (openQueue.size > 0) {
			const current = Array.from(openQueue.values()).sort((a, b) => a.g + a.h - b.g - b.h)[0]
			openQueue.delete(`${current.x},${current.y}`)
			closedQueue.set(`${current.x},${current.y}`, current)

			if (current.x === endNode.x && current.y === endNode.y) {
				// DONE
				foundPath = true
				break
			}

			const neighbors = [[0, -1], [1, 0], [0, 1], [-1, 0]]
				.map(([x, y]) => ({ x: current.x + x, y: current.y + y }))
				.filter(nb => !isOutOfBounds(nb) && !isWall(nb))

			for (const nb of neighbors) {
				const g = current.g + 1
				let h = Math.abs(nb.x - endNode.x) + Math.abs(nb.y - endNode.y)

				const existing = closedQueue.get(`${nb.x},${nb.y}`)
				if (existing) {
					if (g < existing.g) {
						existing.g = g
						existing.h = h
					}
				} else {
					const cell = {
						x: nb.x,
						y: nb.y,
						g,
						h,
						parent: { x: current.x, y: current.y }
					}
					openQueue.set(`${nb.x},${nb.y}`, cell)
				}
			}
		}

		let curr = closedQueue.get(`${end.x},${end.y}`)
		const path: V[] = []
		while (curr && curr.parent) {
			path.push({ x: curr.x, y: curr.y })
			curr = closedQueue.get(`${curr.parent.x},${curr.parent.y}`)
		}

		path.push(start)

		return {
			// path: path.toReversed(),
			path,
			foundPath
		}
	}

	const { path } = findPath(start, end)

	const solutions = {}

	for (let range = 2; range <= maxRange; range++) {
		for (let n = 0; n < path.length; n++) {
			const cheatDests = new Set<string>()
			const p = path[n]
			for (let y = p.y - range; y <= p.y + range; y++) {
				for (let x = p.x - range; x <= p.x + range; x++) {
					if ((Math.abs(x - p.x) + Math.abs(y - p.y) !== range)) {
						continue
					}
					cheatDests.add(`${x},${y}`)
				}
			}
			// find closest along the path to End
			for (let m = path.length - 1; m > n; m--) {
				const p2 = path[m]
				if (cheatDests.has(`${p2.x},${p2.y}`)) {
					const newPathLen = n + (path.length - 1 - m) + range + 1
					const savings = path.length - newPathLen
					if (savings < cutoff) {
						continue
					}
					solutions[savings] = (solutions[savings] || 0) + 1
				}
			}
		}
	}

	const sum = Object.keys(solutions)
		.reduce((acc, curr) => acc + solutions[curr], 0)

	return sum
}

describe('2024/20', async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, 2, 1)
			expect(answer).toBe(44)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, 2, 100)
			expect(answer).toBeLessThan(4223)
			expect(answer).toBe(1381)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, 20, 50)
			expect(answer).toBe(285)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, 20, 100)
			expect(answer).toBe(982124)
		})
	})
})
