// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

async function solve(lines: string[], gridSize: [number, number] = [101, 103], ticks = 100) {
	// p=0,4 v=3,-3
	const re = /^p=(?<p_x>[\d\-]+),(?<p_y>[\d\-]+) v=(?<v_x>[\d\-]+),(?<v_y>[\d\-]+)/

	const robots = []

	for (const line of lines) {
		const { p_x, p_y, v_x, v_y } = re.exec(line)!.groups!
		robots.push({
			p: [parseInt(p_x), parseInt(p_y)],
			v: [parseInt(v_x), parseInt(v_y)]
		})
	}

	const quadrants = [0, 0, 0, 0]

	const grid = Array.from({ length: gridSize[1] }, () => Array.from({ length: gridSize[0] }, () => ' '))

	robots.forEach((robot, i) => {
		const q = [
			(robot.p[0] + robot.v[0] * ticks) % gridSize[0],
			(robot.p[1] + robot.v[1] * ticks) % gridSize[1]
		]
		if (q[0] < 0) q[0] += gridSize[0]
		if (q[1] < 0) q[1] += gridSize[1]

		robots[i].p = q

		grid[q[1]][q[0]] = '#'
	})

	console.log(grid.map(row => row.join('')).join('\n'))

	robots.forEach((robot, i) => {
		if (robot.p[0] + 1 < gridSize[0] / 2 && robot.p[1] + 1 < gridSize[1] / 2) {
			quadrants[0]++
		}
		if (robot.p[0] > gridSize[0] / 2 && robot.p[1] + 1 < gridSize[1] / 2) {
			quadrants[1]++
		}
		if (robot.p[0] + 1 < gridSize[0] / 2 && robot.p[1] > gridSize[1] / 2) {
			quadrants[2]++
		}
		if (robot.p[0] > gridSize[0] / 2 && robot.p[1] > gridSize[1] / 2) {
			quadrants[3]++
		}
	})

	return quadrants.reduce((acc, q) => acc * q, 1)
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(['p=2,4 v=2,-3'], [11, 7], 5)
			expect(answer).toBe(0)
		})

		test('TEST', async () => {
			const answer = await solve(linesTest, [11, 7], 100)
			expect(answer).toBe(12)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, [101, 103], 100)
			expect(answer).toBe(222208000)
		})
	})

	describe('PART 2', async () => {
		test('PROD', async () => {
			const answer = await solve(linesProd, [101, 103], 7623)
			expect(answer).toBe(59640840)
		})
	})
})
