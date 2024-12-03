import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

const day = '01'

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

describe(`day ${day} test`, async () => {
	const lines = await getLines(`${import.meta.dir}/test1.txt`) as string[]

	test('answer 1', async () => {
		const answer = await solve(lines)
		expect(answer).toBe(161);
	})

	const lines2 = await getLines(`${import.meta.dir}/test2.txt`) as string[]

	test('answer 2', async () => {
		const answer = await solve(lines2, true)
		expect(answer).toBe(48);
	})
})

describe(`day ${day} prod`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	test('answer 1', async () => {
		const answer = await solve(lines)
		expect(answer).toBe(179571322);
	})

	test('answer 2', async () => {
		const answer = await solve(lines, true)
		expect(answer).toBeLessThan(105264641)
		expect(answer).toBe(103811193)
	})
})
