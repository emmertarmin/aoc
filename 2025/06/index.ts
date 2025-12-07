// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

async function solve(lines: string[]) {
	let sum = 0
  const nums: number[][] = []
  const ops: string[] = []

	for (const line of lines) {
    const things =  line.trim().split(/\s+/)
    if (/^\d+$/.test(things[0])) {
      nums.push(things.map(Number))
    } else {
      ops.push(...things)
    }
	}

  for (const col of nums[0].keys()) {
    sum += eval(nums.map(n => n[col]).join(` ${ops[col]} `))
  }

	return sum
}

async function solveB(lines: string[]) {
	let sum = 0
  const rows = []

	for (const line of lines) {
    rows.push(line)
	}

  const longest = Math.max(...rows.map(r => r.length))

  let agg: number[] = []
  for (let col = longest - 1; col >= 0; col--) {
    const column = rows.map(row => {
      return row[col] || ' '
    })

    agg.push(Number(column.filter(c => /[0-9]/.test(c)).join('').trim()))
    const op = ['+', '*'].includes(column[column.length - 1]) ? column[column.length - 1] : null
    if (op) {
      sum += eval(agg.filter(n => n > 0).join(` ${op} `))
      agg = []
    }
  }

	return sum
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(4277556)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(5524274308182)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solveB(linesTest)
			expect(answer).toBe(3263827)
		})

		test('PROD', async () => {
			const answer = await solveB(linesProd)
			expect(answer).toBe(8843673199391)
		})
	})
})
