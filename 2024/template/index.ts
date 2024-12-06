// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

async function solve(lines: string[]) {
	let sum = 0

	for (const line of lines) {
		// do something
	}

	return sum
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(0)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(0)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(0)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(0)
		})
	})
})
