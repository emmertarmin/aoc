// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

async function solve(lines: string[], blinks: number) {
	const arr = lines[0].split(' ').map(Number)

	const cache = new Map<string, number>()

	function rec(arr: number[], i: number) {
		if (i === 0) return arr.length

		return arr.reduce((acc, curr) => {
			const key = [curr, i].join(',')
			if (cache.has(key)) {
				return acc + cache.get(key)!
			}
			const str = String(curr)
			let res = 0
			if (curr === 0) {
				res = rec([1], i - 1)
			} else if (str.length % 2 === 0) {
				res = rec([str.slice(0, str.length / 2), str.slice(str.length / 2)].map(Number), i - 1)
			} else {
				res = rec([curr * 2024], i - 1)
			}
			cache.set(key, res)
			return acc + res
		}, 0)
	}

	return rec(arr, blinks)
}

console.log(await solve(['0'], 3))

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test.only('TEST', async () => {
			const answer = await solve(['0 1 10 99 999'], 1)
			expect(answer).toBe(7)
		})

		test.only('TEST', async () => {
			const answer = await solve(linesTest, 6)
			expect(answer).toBe(22)
		})

		test.only('TEST', async () => {
			const answer = await solve(linesTest, 25)
			expect(answer).toBe(55312)
		})

		test.only('PROD', async () => {
			const answer = await solve(linesProd, 25)
			expect(answer).toBe(218956)
		})
	})

	describe('PART 2', async () => {
		test.only('PROD', async () => {
			const answer = await solve(linesProd, 75)
			expect(answer).toBe(259593838049805)
		},)
	})
})
