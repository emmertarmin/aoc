// @ts-ignore: bun-test-ignore-file
import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

type Grid = string[][]

function isInBounds(grid: Grid, {x, y}: {x: number, y: number}) {
	return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length
}

async function solve(lines: string[], rep = false) {
	let sum = 0

	const grid: Grid = []
	const antennas: {[key: string]: {x: number, y: number}[]} = {}

	let y = 0
	for (const line of lines) {
		// do something
		grid.push(line.split(''))
		for (let x = 0; x < line.length; x++) {
			if (line[x] !== '.') {
				antennas[line[x]] = antennas[line[x]] || []
				antennas[line[x]].push({x, y})
			}
		}

		y++
	}

	let nodes = new Set<string>()

	Object.keys(antennas).forEach((type) => {
		antennas[type].forEach((a) => {
			if (rep) nodes.add(`${a.x},${a.y}`)
			antennas[type].forEach((b) => {
				if (a === b) return
				const dx = b.x - a.x
				const dy = b.y - a.y
				const node = {x: a.x - dx, y: a.y - dy}
				while (isInBounds(grid, node)) {
					nodes.add(`${node.x},${node.y}`)
					if (!rep) break
					node.x -= dx
					node.y -= dy
				}
			})
		})
	})

	sum = nodes.size

	return sum
}

describe('2024/08', async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(14)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(265)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, true)
			expect(answer).toBe(34)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, true)
			expect(answer).toBe(962)
		})
	})
})
