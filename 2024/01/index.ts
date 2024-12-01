import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

const day = '01'

async function solve(lines: string[]) {
	let sum = 0

	const a = []
	const b = []

	for (const line of lines) {
		const {l, r} = line.match(/(?<l>\d+)\s+(?<r>\d+)/).groups
		a.push(l)
		b.push(r)
	}

	a.sort()
	b.sort()

	for (let i = 0; i < a.length; i++) {
		const diff = Math.abs(a[i] - b[i])
		sum += diff
	}

	return sum
}

async function solveB(lines: string[]) {
	let sum = 0

	const a = []
	const b = []

	for (const line of lines) {
		const {l, r} = line.match(/(?<l>\d+)\s+(?<r>\d+)/).groups
		a.push(l)
		b.push(r)
	}

	for (const item of a) {
		const freq = b.filter(i => i === item).length
		sum += item*freq
	}

	return sum
}

describe(`day ${day} test`, async () => {
	const lines = await getLines(`${import.meta.dir}/test1.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(lines)).toBe(11);
	})

	test('answer 2', async () => {
		expect(await solveB(lines)).toBe(31);
	})
})

describe(`day ${day} prod`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	test('answer 1', async () => {
		const answer = await solve(lines)
		expect(answer).toBe(1320851);
	})

	test('answer 2', async () => {
		const answer = await solveB(lines)
		expect(answer).toBe(26859182);
	})
})
