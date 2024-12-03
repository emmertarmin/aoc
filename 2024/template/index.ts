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

describe(`test`, async () => {
	const lines = await getLines(`${import.meta.dir}/test1.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(lines)).toBe(0);
	})

	test('answer 2', async () => {
		expect(await solve(lines)).toBe(0);
	})
})

describe(`prod`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	test('answer 1', async () => {
		const answer = await solve(lines)
		expect(answer).toBe(0);
	})

	test('answer 2', async () => {
		const answer = await solve(lines)
		expect(answer).toBe(0);
	})
})
