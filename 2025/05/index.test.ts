// @ts-ignore: bun-test-ignore-file
import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

async function solve(lines: string[]) {
	let sum = 0
	const ranges = new Set<string>()
	const ids = new Set<number>()

	for (const line of lines.filter(l => l.trim().length > 0)) {
		const reRanges = /^(\d+)-(\d+)$/
		const reIds = /^(\d+)$/

		if (reRanges.test(line)) {
			const [, startStr, endStr] = reRanges.exec(line)!
			const start = parseInt(startStr, 10)
			const end = parseInt(endStr, 10)
			ranges.add(`${start}-${end}`)
		} else if (reIds.test(line)) {
			const [, idStr] = reIds.exec(line)!
			const id = parseInt(idStr, 10)
			ids.add(id)
		}
	}

	for (const id of ids) {
		for (const range of ranges) {
			const [start, end] = range.split('-').map(Number)
			if (id >= start && id <= end) {
				sum++
				break
			}
		}
	}

	return sum
}

async function solveB(lines: string[]) {
	let sum = 0
	const ranges = new Set<string>()

	for (const line of lines.filter(l => l.trim().length > 0)) {
		const reRanges = /^(\d+)-(\d+)$/

		if (reRanges.test(line)) {
			const [, startStr, endStr] = reRanges.exec(line)!
			const start = parseInt(startStr, 10)
			const end = parseInt(endStr, 10)
			ranges.add(`${start}-${end}`)
		}
	}

	const actualRanges = new Set<string>()
	for (let range of ranges) {
		let [start, end] = range.split('-').map(Number)
		// Ranges partially or fully overlap, calculate actual ranges
		Array.from(actualRanges).forEach((aRange) => {
			const [aStart, aEnd] = aRange.split('-').map(Number)
			if (end < aStart || start > aEnd) {
				// No overlap
				return
			}
			start = Math.min(start, aStart)
			end = Math.max(end, aEnd)
			actualRanges.delete(`${aStart}-${aEnd}`)
		})
		actualRanges.add(`${start}-${end}`)
	}

	for (const range of actualRanges) {
		const [start, end] = range.split('-').map(Number)
		sum += (end - start + 1)
	}

	return sum
}

describe(`2025/05`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(3)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(558)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solveB(linesTest)
			expect(answer).toBe(14)
		})

		test('PROD', async () => {
			const answer = await solveB(linesProd)
			expect(answer).toBe(344813017450467)
		})
	})
})
