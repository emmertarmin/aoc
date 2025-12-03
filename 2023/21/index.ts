// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '../../2024/io'

/**
 * Lagrange's Interpolation formula for ax^2 + bx + c with x=[0,1,2] and y=[y0,y1,y2] we have
 *   f(x) = (x^2-3x+2) * y0/2 - (x^2-2x)*y1 + (x^2-x) * y2/2
 * so the coefficients are:
 * a = y0/2 - y1 + y2/2
 * b = -3*y0/2 + 2*y1 - y2/2
 * c = y0
 */
const simplifiedLagrange = (values) => {
  return {
    a: values[0] / 2 - values[1] + values[2] / 2,
    b: -3 * (values[0] / 2) + 2 * values[1] - values[2] / 2,
    c: values[0],
  };
};

type Grid = string[][]

function getCell(grid: Grid, {x, y}: {x: number, y: number}, repeat = false) {
	if (!repeat) {
		return grid[y]?.[x]
	}
	x = x % grid[0].length
	if (x < 0) x = x + grid[0].length
	y = y % grid.length
	if (y < 0) y = y + grid.length
	return grid[y][x]
}

function count(grid: Grid, iters, startingPos, repeat) {
	let curr = new Set<string>()
	curr.add(startingPos.join(','))
	let next = new Set<string>()
	for (let i = 0; i < iters; i++) {
		for (const pos of curr) {
			const [y, x] = pos.split(',').map(Number)
			const neighbours = [[-1, 0], [1, 0], [0, -1], [0, 1]]
				.map(([dy, dx]) => [y + dy, x + dx])
				.filter(([ny, nx]) => getCell(grid, {x: nx, y: ny}, repeat) === '.')
				.forEach(([ny, nx]) => {
					next.add([ny, nx].join(','))
				})
		}
		curr = next
		next = new Set<string>()
	}
	return curr.size
}

async function solve(lines: string[], iters: number, repeat = false) {
	let sum = 0

	const grid: Grid = []
	let startingPos: [number, number] = [0, 0]

	for (const line of lines) {
		// do something
		grid.push(line.split('').map(c => c === 'S' ? '.' : c))
		if (line.includes('S')) {
			startingPos = [grid.length - 1, line.indexOf('S')]
		}
	}

	if (iters < 500) {
		return count(grid, iters, startingPos, repeat)
	}

	const t1 = Math.floor(grid.length/2)
	const t2 = Math.floor(grid.length/2) + grid.length
	const t3 = Math.floor(grid.length/2) + grid.length*2

	const y1 = count(grid, t1, startingPos, true)
	const y2 = count(grid, t2, startingPos, true)
	const y3 = count(grid, t3, startingPos, true)

	console.log(`${y1} = a*${t1*t1} + b*${t1} + c`)
	console.log(`${y2} = a*${t2*t2} + b*${t2} + c`)
	console.log(`${y3} = a*${t3*t3} + b*${t3} + c`)

	const {a, b, c} = simplifiedLagrange([y1, y2, y3])

	sum = a * iters * iters + b * iters + c

	return sum
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test.only('TEST', async () => {
			const answer = await solve(linesTest, 6)
			expect(answer).toBe(16)
		})

		test.only('PROD', async () => {
			const answer = await solve(linesProd, 64)
			expect(answer).toBe(3660)
		})
	})

	describe('PART 2', async () => {
		test.only('TEST', async () => {
			expect(await solve(linesTest, 6, true)).toBe(16)
			expect(await solve(linesTest, 10, true)).toBe(50)
			expect(await solve(linesTest, 50, true)).toBe(1594)
			expect(await solve(linesTest, 100, true)).toBe(6536)
			expect(await solve(linesTest, 500, true)).toBe(167004)
			// expect(await solve(linesTest, 1000, true)).toBe(668697)
			// expect(await solve(linesTest, 5000, true)).toBe(16733044)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, 26501365)
			expect(answer).toBe(0)
		})
	})
})
