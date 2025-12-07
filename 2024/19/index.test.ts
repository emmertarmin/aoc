// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

async function solve(lines: string[], part2 = false) {
	const cache = new Map<string, number>()

	let availables
	const patterns: string[] = []

	for (const line of lines) {
		if (line.includes(',')) {
			availables = new Set<string>(line.split(', '))
		} else {
			patterns.push(line)
		}
	}

	function rec(prefix: string, pattern: string) {
		if (cache.has(pattern)) {
			return cache.get(pattern)
		}

		if (pattern.length === 0) {
			return 1
		}

		const result = Array.from(availables.values())
			.filter((a: string) => pattern.startsWith(a))
			.map((a: string) => {
				const rest = pattern.slice(a.length)
				return rec(prefix + ' ' + a, rest)
			})
			.reduce((acc, curr) => acc + curr, 0)
		cache.set(pattern, result)
		return result
	}

	const solutions = []
	for (const pattern of patterns) {
		solutions.push(rec('', pattern))
	}

	if (!part2) {
		return solutions.filter((s) => s > 0).length
	}

	return solutions.reduce((acc, curr) => acc + curr, 0)
}

describe('2024/19', async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(6)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBeLessThan(361)
			expect(answer).toBe(272)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, true)
			expect(answer).toBe(16)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, true)
			expect(answer).toBe(1041529704688380)
		})
	})
})
