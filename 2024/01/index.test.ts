import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

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

describe('2024/01', async () => {
  const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
  const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

  describe('PART 1', async () => {
    test('TEST', async () => {
      expect(await solve(linesTest)).toBe(11)
    })

    test('PROD', async () => {
      const answer = await solve(linesProd)
      expect(answer).toBe(1320851)
    })
  })

  describe('PART 2', async () => {
    test('TEST', async () => {
      expect(await solveB(linesTest)).toBe(31)
    })

    test('PROD', async () => {
      const answer = await solveB(linesProd)
      expect(answer).toBe(26859182)
    })
  })
})

