// @ts-ignore: bun-test-ignore-file
import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

function rec(str: string, digits: number): number {
	if (digits === 1) {
		return Math.max(...str.split('').map(Number))
	}
	let msb = Math.max(...str.slice(0, str.length - (digits - 1)).split('').map(Number))
	let rest = str.slice(str.indexOf(String(msb)) + 1)
	return msb * Math.pow(10, digits - 1) + rec(rest, digits - 1)
}

async function solve(lines: string[], digits = 2) {
	let sum = 0

	for (const line of lines) {
		sum += rec(line, digits)
	}

	return sum
}

describe(`2025/03`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(357)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(17092)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, 12)
			expect(answer).toBe(3121910778619)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, 12)
			expect(answer).toBe(170147128753455)
		})
	})
})
