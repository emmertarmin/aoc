import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

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

describe('2024/02', async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			expect(await solve(linesTest)).toBe(2)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(332)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			expect(await solve(linesTest, 1)).toBe(4)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, 1)
			expect(answer).toBe(398)
		})
	})
})
