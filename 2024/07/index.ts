// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

async function solve(lines: string[], ops: string[] = ['*', '+']) {
	let equations = []

	for (const line of lines) {
		const { res, arr } = line.match(/(?<res>\d+): (?<arr>[\d+ ]+)/).groups
		equations.push({ res: Number(res), arr: arr.split(' ').map(Number) })
	}

	function rec({ res, arr }: { res: number, arr: number[] }) {
		if (arr.length === 0) { throw new Error('arr is empty') }
		if (arr[0] > res) { return false }
		if (arr.length === 1) { return res === arr[0] }

		return ops.some(op => {
			return rec({
				res,
				arr: [
					op === '*' ? arr[0] * arr[1] : op === '+' ? arr[0] + arr[1] : Number([arr[0],arr[1]].join('')),
					...arr.slice(2)
				]
			})
		})
	}

	return equations
		.filter(eq => rec(eq))
		.reduce((acc, { res }) => acc + res, 0)
}
describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(3749)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBeGreaterThan(1053060170)
			expect(answer).toBe(303876485655)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, ['||', '*', '+'])
			expect(answer).toBe(11387)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, ['||', '*', '+'])
			expect(answer).toBe(146111650210682)
		})
	})
})
