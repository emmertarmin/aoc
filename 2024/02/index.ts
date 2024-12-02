import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

const day = '01'

function reportIsSafe(report, faultTolerance = 0) {
	const reportOptions = report.map((_, i) => {
		let opt = [...report]
		opt.splice(i, faultTolerance)
		return opt
	})

	// console.log(reportOptions)

	let safe = []

	for (const levels of reportOptions) {
		let derivate = []
		for (let i = 0; i < levels.length - 1; i++) {
			derivate.push(levels[i + 1] - levels[i])
		}

		const stepsSafe = derivate.map(Math.abs).every(step => step >= 1 && step <= 3)
		const dirSafe = derivate.map(Math.sign).every(step => step === 1) || derivate.map(Math.sign).every(step => step === -1)

		// console.log(levels, derivate, stepsSafe, dirSafe)

		safe.push(stepsSafe && dirSafe)
	}

	return safe.some(Boolean)
}

async function solve(lines: string[], faultTolerance = 0) {
	let sum = 0

	for (const line of lines) {
		const report = line.match(/(\d+)/g).map(Number)
		const safe = reportIsSafe(report, faultTolerance)
		sum += safe ? 1 : 0
	}

	return sum
}

describe(`day ${day} test`, async () => {
	const lines = await getLines(`${import.meta.dir}/test1.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(lines)).toBe(2);
	})

	test('answer 2', async () => {
		expect(await solve(lines, 1)).toBe(4);
	})
})

describe(`day ${day} prod`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	test('answer 1', async () => {
		const answer = await solve(lines)
		expect(answer).toBe(332);
	})

	test('answer 2', async () => {
		const answer = await solve(lines, 1)
		expect(answer).toBe(398);
	})
})
