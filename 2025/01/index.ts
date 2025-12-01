// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

async function solve(lines: string[], countTraversals = false) {
	let curr = 50
	let counter = 0
	for (const line of lines) {
		const [dir, dist] = /(L|R)(\d+)/.exec(line)!.slice(1)

		for (let i = 0; i < parseInt(dist); i++) {
			curr = ((curr + (dir === 'L' ? -1 : 1)) + 100) % 100

			if (countTraversals && curr === 0) counter++
		}

		if (!countTraversals && curr === 0) counter++
	}

	return counter
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(3)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(1168)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, true)
			expect(answer).toBe(6)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, true)
			expect(answer).toBe(7199)
		})
	})
})
