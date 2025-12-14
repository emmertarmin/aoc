// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

let reds: {x: number, y: number}[] = []
let nReds: {x: number, y: number}[] = []

async function solve(lines: string[], constraint = false) {
	// define red tiles, which are potential corners
	reds = []
	for (const line of lines) {
		if (line.trim() === '') continue
		const [x, y] = line.split(',')
		reds.push({x: Number(x), y: Number(y)})
	}
	console.log(`Reds: ${reds.length}`)

	// normalize reds to omit non-relevant rows and columns
	const xs = Array.from(new Set(reds.map(r => r.x))).sort((a, b) => a - b)
	const ys = Array.from(new Set(reds.map(r => r.y))).sort((a, b) => a - b)
	nReds = reds.map(r => ({
		...r,
		x: xs.indexOf(r.x) * 2,
		y: ys.indexOf(r.y) * 2,
	}))

	const nGrid = new Map<string, boolean>()

	// determine green tiles
	function tile(x: number, y: number): boolean {
		const isRed = nReds.some(r => r.x === x && r.y === y)

		const isEdge = (nReds.some(r => r.x <= x && r.y == y) && nReds.some(r => r.x >= x && r.y == y))
			|| (nReds.some(r => r.x == x && r.y <= y) && nReds.some(r => r.x == x && r.y >= y))

		const result = isRed || isEdge
		return result
	}

	// calculate greens
	let curr = false
	let prev = false
	for (let x = -1; x <= Math.max(...nReds.map(r => r.x)) + 1; x++) {
		for (let y = -1; y <= Math.max(...nReds.map(r => r.y)) + 1; y++) {
			// we always start from outside tiles, and turn to inside then
		}
	}

	// print grid for debugging
	const minX = Math.min(...nReds.map(r => r.x)) - 1
	const maxX = Math.max(...nReds.map(r => r.x)) + 1
	const minY = Math.min(...nReds.map(r => r.y)) - 1
	const maxY = Math.max(...nReds.map(r => r.y)) + 1
	// console.log(`Gridsize = ${Math.abs(minX - maxX)} x ${Math.abs(minY - maxY)}`)
	for (let y = minY; y <= maxY; y++) {
		let row = ''
		for (let x = minX; x <= Math.min(maxX, minX+150); x++) {
			if (tile(x, y)) {
				row += 'X'
			} else {
				row += ' '
			}
		}
		console.log(row)
	}

	// compute outside tiles in order to infer greens later

	// calculate max area
	let maxArea = 0

	for (let i = 0; i < nReds.length - 1; i++) {
		for (let j = i + 1; j < nReds.length; j++) {
			const dx = Math.abs(reds[i].x - reds[j].x) + 1
			const dy = Math.abs(reds[i].y - reds[j].y) + 1
			const area = dx * dy

			if (area <= maxArea) continue

			if (constraint) {
				let onlyRedsAndGreens = true
				for (let x = Math.min(nReds[i].x, nReds[j].x); x <= Math.max(nReds[i].x, nReds[j].x); x++) {
					for (let y = Math.min(nReds[i].y, nReds[j].y); y <= Math.max(nReds[i].y, nReds[j].y); y++) {
						if (!tile(x, y)) {
							onlyRedsAndGreens = false
							break
						}
					}
					if (!onlyRedsAndGreens) break
				}
				if (!onlyRedsAndGreens) continue
			}
			maxArea = area
		}
	}

	return maxArea
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(50)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(4745816424)
		})
	})

	describe('PART 2', async () => {
		// test('TEST', async () => {
		// 	const answer = await solve(linesTest, true)
		// 	expect(answer).toBe(24)
		// })

		// test('PROD', async () => {
		// 	const answer = await solve(linesProd, true)
		// 	expect(answer).toBeLessThanOrEqual(4745816424)
		// 	expect(answer).toBeLessThan(4661665300)
		// 	expect(answer).toBe(0)
		// })
	})
})
