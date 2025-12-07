// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

async function solve(lines: string[], distinctTrails = false) {
	let sum = 0

	let grid: number[][] = []

	const startPoints = []
	const endPoints = []

	for (const line of lines) {
		const values = line.split('').map(c => c === '.' ? '-1' : c).map(c => Number(c))
		grid.push(values)
		values.forEach((c, i) => {
			if (c === 0) { startPoints.push([grid.length - 1, i]) }
			if (c === 9) { endPoints.push([grid.length - 1, i]) }
		})
	}

	function rec([y, x]: [number, number], h: number): number[][] {
		const nb = [[-1, 0], [0, 1], [1, 0], [0, -1]]
			.map(([dy, dx]) => [y + dy, x + dx])
			.filter(([ny, nx]) => ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length)
			.filter(([ny, nx]) => grid[ny][nx] === h + 1)

		if (h === 8) {
			return nb.filter(([ny, nx]) => grid[ny][nx] === 9)
		}

		return nb.reduce((acc, [ny, nx]) => [...acc, ...rec([ny, nx], h + 1)], [])
	}

	startPoints.forEach(([sy, sx]) => {
		if (!distinctTrails) {
			const reachable = new Set()
			rec([sy, sx], 0).forEach(([y, x]) => reachable.add(`${y},${x}`))
			sum += reachable.size
		} else {
			sum += rec([sy, sx], 0).length
		}
	})

	return sum
}

describe('2024/10', async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('smalltest 1', async () => {
			const answer = await solve([
				'0123',
				'1234',
				'8765',
				'9876'
			])
			expect(answer).toBe(1)
		})

		test('smalltest 2', async () => {
			const answer = await solve([
				'...0...',
				'...1...',
				'...2...',
				'6543456',
				'7.....7',
				'8.....8',
				'9.....9'
			])
			expect(answer).toBe(2)
		})

		test('smalltest 3', async () => {
			const answer = await solve([
				'..90..9',
				'...1.98',
				'...2..7',
				'6543456',
				'765.987',
				'876....',
				'987....'
			])
			expect(answer).toBe(4)
		})

		test('smalltest 4', async () => {
			const answer = await solve([
				'10..9..',
				'2...8..',
				'3...7..',
				'4567654',
				'...8..3',
				'...9..2',
				'.....01'
			])
			expect(answer).toBe(3)
		})

		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(36)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(629)
		})
	})

	describe('PART 2', async () => {
		test('smalltest 1', async () => {
			const answer = await solve([
				'.....0.',
				'..4321.',
				'..5..2.',
				'..6543.',
				'..7..4.',
				'..8765.',
				'..9....'
			], true)
			expect(answer).toBe(3)
		})

		test('smalltest 2', async () => {
			const answer = await solve([
				'..90..9',
				'...1.98',
				'...2..7',
				'6543456',
				'765.987',
				'876....',
				'987....'
			], true)
			expect(answer).toBe(13)
		})

		test('smalltest 3', async () => {
			const answer = await solve([
				'012345',
				'123456',
				'234567',
				'345678',
				'4.6789',
				'56789.'
			], true)
			expect(answer).toBe(227)
		})

		test('TEST', async () => {
			const answer = await solve(linesTest, true)
			expect(answer).toBe(81)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, true)
			expect(answer).toBe(1242)
		})
	})
})
