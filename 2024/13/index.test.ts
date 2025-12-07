// @ts-ignore: bun-test-ignore-file
import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

type Point = [bigint, bigint]

function solveEquation(v_a: Point, v_b: Point, v_p: Point): Point {
  const [x_1, y_1] = v_a
  const [x_2, y_2] = v_b
  const [p, q] = v_p

  if (x_2 * y_1 - x_1 * y_2 === 0n) {
    throw new Error('Invalid input, would result in division by zero')
  }

  // check if integer solution exists
  if (
    (q * x_2 - p * y_2) % (x_2 * y_1 - x_1 * y_2) !== 0n
    || (p * y_1 - q * x_1) % (x_2 * y_1 - x_1 * y_2) !== 0n
  ) {
    throw new Error('No integer solution')
  }

  let a = (q * x_2 - p * y_2) / (x_2 * y_1 - x_1 * y_2)
  let b = (p * y_1 - q * x_1) / (x_2 * y_1 - x_1 * y_2)

  return [a, b]
}

async function solve(lines: string[], partB = false) {
	let sum = 0n

	const machines = []

	const reA = /Button A: X\+(\d+), Y\+(\d+)/
	const reB = /Button B: X\+(\d+), Y\+(\d+)/
	const reP = /Prize: X=(\d+), Y=(\d+)/

	let acc: any = {}

	for (const line of lines) {
		if (reA.test(line)) {
			const [_, p, q] = reA.exec(line)
			acc.a = [BigInt(p), BigInt(q)]
		}

		if (reB.test(line)) {
			const [_, p, q] = reB.exec(line)
			acc.b = [BigInt(p), BigInt(q)]
		}

		if (reP.test(line)) {
			const [_, p, q] = reP.exec(line)
			const offset = partB ? 10000000000000n : 0n
			acc.p = [BigInt(p) + offset, BigInt(q) + offset]
			machines.push(acc)
			acc = {}
		}
	}

	for (const machine of machines) {
		const { a, b, p } = machine

		let valA = 0n, valB = 0n

		// check if solution exists
		try {
			[valA, valB] = solveEquation(a, b, p)
		} catch (e) {
			// console.log(e.message)
		}

		// console.log(a, b, p, valA, valB)

		sum += 3n * valA + valB
	}

	return Number(sum)
}

describe('2024/13', async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(480)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(33427)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, true)
			expect(answer).toBe(875318608908) // not actually provided by the puzzle
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, true)
			expect(answer).toBe(91649162972270)
		})
	})
})
