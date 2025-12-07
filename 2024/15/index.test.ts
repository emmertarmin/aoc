// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

type Cell = '#' | '.' | 'O' | '@' | '[' | ']'
type V = { x: number, y: number }

async function solve(lines: string[], part2 = false) {
	let sum = 0
	let grid: Cell[][] = []
	const robot = { x: 0, y: 0 }
	let ctl = ''

	let y = 0
	for (let line of lines) {
		if (part2) {
			line = line
				.replace(/#/g, '##')
				.replace(/O/g, '[]')
				.replace(/\./g, '..')
				.replace(/@/g, '@.')
		}

		/**
		 * robot and grid
		 */
		if (line.includes('#')) {
			if (line.includes('@')) {
				robot.x = line.indexOf('@')
				robot.y = y
			}
			grid.push(line.replace('@', '.').split('') as Cell[])
			y++
		}

		/**
		 * control sequence
		 */
		if (line.match(/[\^>v<]/)) {
			ctl += line
		}
	}

	for (const c of ctl) {
		const move = {
			'^': { x: 0, y: -1 },
			'>': { x: 1, y: 0 },
			'v': { x: 0, y: 1 },
			'<': { x: -1, y: 0 }
		}[c]

		const tempGrid = structuredClone(grid)

		function rec(arr: { x: number, y: number, val: Cell, prev: Cell }[], v: V): boolean {
			// early exit condition
			if (arr.length === 0) {
				return true
			}
			if (arr.some(({ x, y }) => grid[y + v.y][x + v.x] === '#')) {
				return false
			}


			const nextMap = new Map<string, { val: Cell, prev: Cell }>()
			arr.forEach(({ x, y, val, prev }) => {
				tempGrid[y + v.y][x + v.x] = val
				tempGrid[y][x] = prev
				const nextVal = grid[y + v.y][x + v.x]
				nextMap.set(`${x + v.x},${y + v.y}`, { val: nextVal, prev: val })
			})

			if (Math.abs(v.y) === 1) {
				// moving vertically
				nextMap.forEach((value, key) => {
					const [x, y] = key.split(',').map(Number)
					if (value.val === '[' && !nextMap.has(`${x + 1},${y}`)) {
						nextMap.set(`${x + 1},${y}`, { val: ']', prev: '.' })
					}
					if (value.val === ']' && !nextMap.has(`${x - 1},${y}`)) {
						nextMap.set(`${x - 1},${y}`, { val: '[', prev: '.' })
					}
				})
			}

			const nextArr = [...nextMap.entries()].map(([key, { val, prev }]) => {
				const [x, y] = key.split(',').map(Number)
				return { x, y, val, prev }
			})

			return rec(nextArr.filter(({ val }) => ['O', '[', ']'].includes(val)), v)
		}

		let canMove = rec([{ ...structuredClone(robot), val: '@', prev: '.' }], move)

		if (canMove) {
			robot.x += move.x
			robot.y += move.y
			grid = structuredClone(tempGrid)
		}
	}

	grid.forEach((row, y) => {
		row.forEach((col, x) => {
			if (['[', 'O'].includes(col)) {
				sum += 100 * y + x
			}
		})
	})

	return sum
}

describe('2024/15', async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesTest2 = await getLines(`${import.meta.dir}/test2.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(2028)
		})

		test('TEST', async () => {
			const answer = await solve(linesTest2)
			expect(answer).toBe(10092)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(1406628)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest2, true)
			expect(answer).toBe(9021)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, true)
			expect(answer).toBe(1432781)
		})
	})
})
