// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

// tell if string is of a repeating pattern
function strIsOfPattern (str: string) {
	const n = str.length
	for (let i = Math.ceil(n / 2); i >= 1; i--) {
		if (n % i !== 0) continue
		const pattern = str.slice(0, i)
		if (str === pattern.repeat(n / i)) {
			return {
				isPattern: true,
				pattern: pattern,
				repeats: n / i
			}
		}
	}
	return { isPattern: false }
}

async function solve(lines: string[], any = false) {
	let sum = 0
	let ranges = []

	for (const line of lines) {
		ranges = [...ranges, ...line.split(',').filter(Boolean).map(r => r.split('-').map(Number))]
	}

	for (const range of ranges) {
		for (let i = range[0]; i <= range[1]; i++) {
			const str = String(i)
			const {isPattern, pattern, repeats} = strIsOfPattern(str)
			if (isPattern && (repeats === 2 || (any && repeats >= 2))) {
				sum += i
			}
		}
	}

	return sum
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(1227775554)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(12586854255)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, true)
			expect(answer).toBe(4174379265)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, true)
			expect(answer).toBe(17298174201)
		})
	})
})
