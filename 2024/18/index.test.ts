// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

type V = { x: number, y: number }
type Cell = V & { g: number, h: number, parent: V | null }

async function solve(lines: string[], size: V, amount: number, part2 = false) {
	let sum = 0

	const start: V = { x: 0, y: 0 }
	const end: V = { x: size.x, y: size.y }
	const grid = Array.from({ length: size.y + 1 }, () => Array.from({ length: size.x + 1 }, () => 0))

	const bytes: V[] = []

	for (const line of lines) {
		const { x, y } = line.match(/(?<x>\d+),(?<y>\d+)/)!.groups!
		bytes.push({ x: +x, y: +y })
	}

	bytes.slice(0, amount).forEach(({ x, y }) => grid[y][x] = 1)

	function isOutOfBounds(v: V) {
		return v.x < 0 || v.y < 0 || v.x >= grid[0].length || v.y >= grid.length
	}

	function isWall(v: V) {
		return grid[v.y][v.x] === 1
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

			const neighbors = [[0, -1], [1, 0], [0, 1], [-1, 0]].map(([x, y]) => ({ x: current.x + x, y: current.y + y }))

			for (const nb of neighbors) {
				if (isOutOfBounds(nb) || isWall(nb)) {
					continue
				}

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

		return {
			path,
			foundPath
		}
	}

	if (!part2) {
		const { path } = findPath(start, end)
		return path.length
	}

	// Part 2
	let currentPath = new Set<string>()
	for (const {x, y} of bytes.slice(amount)) {
		grid[y][x] = 1

		// optimization: we don't need to recompute path if falling byte isn't blocking it
		if (currentPath.size > 0 && !currentPath.has(`${x},${y}`)) {
			continue
		}
		const {foundPath, path} = findPath(start, end)
		path.forEach(({x, y}) => currentPath.add(`${x},${y}`))

		if (!foundPath) {
			return `${x},${y}`
		}
	}
}

describe('2024/18', async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, { x: 6, y: 6 }, 12)
			expect(answer).toBe(22)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, { x: 70, y: 70 }, 1024)
			expect(answer).toBe(292)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, { x: 6, y: 6 }, 12, true)
			expect(answer).toBe('6,1')
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, { x: 70, y: 70 }, 1024, true)
			expect(answer).toBe('58,44')
		})
	})
})
