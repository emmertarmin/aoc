// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

async function solve(lines: string[], part2 = false) {
	let sum = 0

	// const cache = new Map<string, number>()

	let availables
	const patterns: string[] = []

	for (const line of lines) {
		if (line.includes(',')) {
			// line.split(', ').forEach((n) => availables.add(n))
			availables = new Set<string>(line.split(', '))
		} else {
			patterns.push(line)
		}
	}

	// console.log({ availables: Array.from(availables.values()).toSorted((a: string, b: string) => a.length - b.length), patterns })

	function depth(arr) {
		if (Array.isArray(arr)) {
			return 1 + Math.max(...arr.map(depth))
		}
		return 0
	}

	function rec(pattern: string) {
		// if (cache.has(pattern)) {
			// return cache.get(pattern) as string[]
		// }

		// base case
		if (pattern.length === 0) {
			return ['']
		}

		return Array.from(availables.values()).filter((a: string) => pattern.startsWith(a)).map((a: string) => {
			const nextPattern = pattern.slice(a.length) || ''
			// console.log(a, nextPattern)
			if (!nextPattern) {
				return [a]
			}
			const result = rec(nextPattern).map((t) => [a, ...t])
			if (result[0].every(r => !Array.isArray(r))) {
				console.log('is not array', result)
			}
			return result
		})
	}

	let i = 0
	for (const pattern of patterns) {
		const towels = rec(pattern)
		console.log({ pattern, towels })
		console.log({depth: towels.map(depth)})
		// console.log({r: towels.map(r)})
		i++
		if (i > 3) { break }
	}


	return 0
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test.only('TEST', async () => {
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
			expect(answer).toBe(0)
		})
	})
})
