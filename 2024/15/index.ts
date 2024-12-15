// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

type Cell = '#' | '.' | 'O'
type Cell2 = '#' | '.' | '[' | ']'
type V = { x: number, y: number }

async function solve(lines: string[]) {
	let sum = 0
	const grid: Cell[][] = []
	const robot = { x: 0, y: 0 }
	let ctl = ''

	let y = 0
	for (const line of lines) {
		/**
		 * robot and grid
		 */
		if (line.includes('@')) {
			robot.x = line.indexOf('@')
			robot.y = y
		}
		if (line.includes('#')) {
			grid.push(line.replace('@', '.').split('') as Cell[])
		}
		y++

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

		const check = structuredClone(robot)
		let canMove = false
		let empty = { x: undefined, y: undefined }
		let isBox = false
		while (true) {
			check.x += move.x
			check.y += move.y
			if (grid[check.y][check.x] === '#') {
				break
			}
			if (grid[check.y][check.x] === 'O') {
				isBox = true
				continue
			}
			if (grid[check.y][check.x] === '.') {
				canMove = true
				empty = { x: check.x, y: check.y }
				break
			}
			throw new Error('unexpected')
		}
		if (canMove) {
			if (isBox) {
				grid[empty.y][empty.x] = 'O'
			}
			grid[robot.y][robot.x] = '.'
			robot.x += move.x
			robot.y += move.y
		}
		grid[robot.y][robot.x] = '.'
	}

	// console.log(grid.map((row, y) => row.map((col, x) => robot.x === x && robot.y === y ? col : col).join('').replace(/\./g, ' ')).join('\n'))

	grid.forEach((row, y) => {
		row.forEach((col, x) => {
			if (col === 'O') {
				sum += 100 * y + x
			}
		})
	})

	return sum
}

async function solveB(lines: string[]) {
	let sum = 0
	const grid: Cell2[][] = []
	const robot = { x: 0, y: 0 }
	let ctl = ''

	let y = 0
	for (let line of lines) {
		line = line
			.replace(/#/g, '##')
			.replace(/O/g, '[]')
			.replace(/\./g, '..')
			.replace(/@/g, '@.')

		/**
		 * robot and grid
		 */
		if (line.includes('@')) {
			robot.x = line.indexOf('@')
			robot.y = y
		}
		if (line.includes('#')) {
			grid.push(line.split('') as Cell2[])
		}
		y++

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

		const res = structuredClone(grid)
		
		function rec(arr, V) {

		}

		const canMove = rec([robot], move)
	}

	// console.log(grid.map((row, y) => row.map((col, x) => robot.x === x && robot.y === y ? col : col).join('').replace(/\./g, ' ')).join('\n'))

	grid.forEach((row, y) => {
		row.forEach((col, x) => {
			if (col === 'O') {
				sum += 100 * y + x
			}
		})
	})

	return sum
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesTest2 = await getLines(`${import.meta.dir}/test2.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST 1', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(2028)
		})

		test('TEST 2', async () => {
			const answer = await solve(linesTest2)
			expect(answer).toBe(10092)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(1406628)
		})
	})

	describe('PART 2', async () => {
		test.only('TEST', async () => {
			const answer = await solveB(linesTest2)
			expect(answer).toBe(9021)
		})

		test('PROD', async () => {
			const answer = await solveB(linesProd)
			expect(answer).toBe(0)
		})
	})
})
