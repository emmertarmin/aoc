import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

const day = '22'

async function solve(lines: string[]) {
  for (const line of lines) {
    console.log(line)
  }
}

describe(`day ${day}`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

  describe('part 1 test', async () => {
    test.only('answer', async () => {
      const answer = await solve(linesTest)
      expect(answer).toBe(-1);
    })
	})
  describe('part 1 prod', async () => {
    test('answer', async () => {
      const answer = await solve(linesProd)
      expect(answer).toBe(-1);
    })
  })

  describe('part 2 test', async () => {
    test('answer', async () => {
      const answer = await solve(linesTest)
      expect(answer).toBe(-1);
    })
  })

  describe('part 2 prod', async () => {
    test('answer', async () => {
      const answer = await solve(linesProd)
      expect(answer).toBe(-1);
    })
  })

})
