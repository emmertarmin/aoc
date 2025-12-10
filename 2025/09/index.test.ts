// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

let reds = new Set<string>()

async function solve(lines: string[]) {
	reds = new Set<string>()

	for (const line of lines) {
		if (line.trim() === '') continue
		const [x, y] = line.split(',')
		reds.add(`${x},${y}`)
	}

	let maxArea = 0

	const redsArray = Array.from(reds)
		.map(s => {
			const [x, y] = s.split(',')
			return {x: Number(x), y: Number(y)}
		})

	for (let i = 0; i < redsArray.length - 1; i++) {
		for (let j = i + 1; j < redsArray.length; j++) {
			const dx = Math.abs(redsArray[i].x - redsArray[j].x) + 1
			const dy = Math.abs(redsArray[i].y - redsArray[j].y) + 1
			const area = dx * dy
			if (area > maxArea) {
				maxArea = area
			}
		}
	}

	return maxArea
}

async function solveB(lines: string[]) {
	const reds: {x: number, y: number}[] = []

	for (const line of lines) {
		if (line.trim() === '') continue
		const [x, y] = line.split(',')
		reds.push({x: Number(x), y: Number(y)})
	}

	const minX = Math.min(...reds.map(p => p.x)) - 2
	const maxX = Math.max(...reds.map(p => p.x)) + 2
	const minY = Math.min(...reds.map(p => p.y)) - 1
	const maxY = Math.max(...reds.map(p => p.y)) + 1

	for (let y = minY; y <= maxY; y++) {
		let row = ''
		for (let x = minX; x <= maxX; x++) {
			row += reds.find(p => p.x === x && p.y === y) ? 'R' : '.'
		}
		console.log(row)
	}

	let maxArea = 0

	for (let i = 0; i < reds.length - 1; i++) {
		for (let j = i + 1; j < reds.length; j++) {
			const dx = Math.abs(reds[i].x - reds[j].x) + 1
			const dy = Math.abs(reds[i].y - reds[j].y) + 1
			const area = dx * dy
			if (area > maxArea) {
				maxArea = area
			}
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
		test('TEST', async () => {
			const answer = await solveB(linesTest)
			expect(answer).toBe(0)
		})

		// test('PROD', async () => {
		// 	const answer = await solveB(linesProd)
		// 	expect(answer).toBe(0)
		// })
	})
})
