// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

async function solve(lines: string[], startNode: string, needToVisit: string[] = []) {
	let sum = 0

	const conns = {}
	const cache = new Map<string, number>()

	for (const line of lines) {
		const matches = line.match(/^([\w]{3}): (.*)$/)!
		conns[matches[1]] = matches[2].split(' ')
	}

	function rec(node: string, req: string[], path = []): number {
		const key = `${node}|${req.join(',')}`
		if (cache.has(key)) {
			const answer = cache.get(key)!
			// console.log(cache.size, answer, [...path, node].join('->'))
			return answer
		}

		if (node === 'out') {
			const answer = req.length === 0 ? 1 : 0
			// console.log(cache.size, answer, [...path, 'out'].join('->'))
			cache.set(key, answer)
			return answer
		}

		if (req.includes(node)) req = req.filter(r => r !== node)

			const answer = conns[node].reduce((acc, curr) => acc + rec(curr, req, [...path, node]), 0)
			cache.set(key, answer)
			return answer
	}

	sum = rec(startNode, needToVisit.toSorted(), [])

	return sum
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesTest2 = await getLines(`${import.meta.dir}/test2.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, 'you')
			expect(answer).toBe(5)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, 'you')
			expect(answer).toBe(585)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest2, 'svr', ['dac', 'fft'])
			expect(answer).toBe(2)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, 'svr', ['dac', 'fft'])
			expect(answer).toBe(349322478796032)
		})
	})
})
