import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

async function solve(lines: string[], dodont = false) {
	let doo = 1
	let sum = 0

	for (const line of lines) {

		const partial = line
			.match(/(mul\(\d+,\d+\))|(do\(\))|(don't\(\))/g)
			.reduce((acc, curr) => {
				if (curr.match(/do\(\)/)) {
					doo = 1
					return acc
				} else if (curr.match(/don't\(\)/)) {
					if (dodont) doo = 0
					return acc
				} else {
					const { a, b } = curr.match(/mul\((?<a>\d+),(?<b>\d+)\)/).groups
					return acc + doo * parseInt(a) * parseInt(b)
				}
			}, 0)
		sum += partial
	}

	return sum
}

describe('2024/03', async () => {
	const linesTest1 = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesTest2 = await getLines(`${import.meta.dir}/test2.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest1)
			expect(answer).toBe(161)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(179571322)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest2, true)
			expect(answer).toBe(48)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, true)
			expect(answer).toBeLessThan(105264641)
			expect(answer).toBe(103811193)
		})
	})
})
