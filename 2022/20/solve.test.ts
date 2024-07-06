import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

const day = '20'

async function solve(lines: string[], decryptionKey: number = 1, mixTimes: number = 1) {
  const arr = []
  let i = 0
  for (const line of lines) {
    arr.push({index: i++, value: parseInt(line) * decryptionKey})
  }

  const len = arr.length

  function move (index: number, value: number) {
    const currIndex = arr.findIndex(i => i.index === index)
    let newIndex = currIndex + value
    if (newIndex <= 0) {
      // while (newIndex <= 0) newIndex += len - 1
      newIndex += Math.floor(-newIndex / (len - 1)) * (len - 1)
    }
    if (newIndex >= len) {
      // while (newIndex >= len) newIndex -= len - 1
      newIndex -= Math.floor(newIndex / (len - 1)) * (len - 1)
    }

    arr.splice(currIndex, 1)
    arr.splice(newIndex, 0, {index, value})
  }

  for (let t = 0; t < mixTimes; t++) {
    console.log(`mix ${t+1}`)
    for (let i = 0; i < len; i++) {
      const item = arr.find(item => item.index === i)
      move(i, item.value)
    }
  }

  const indexOfZero = arr.findIndex(i => i.value === 0)
  return [1000, 2000, 3000]
    .map(i => arr[(indexOfZero + i) % len].value)
    .reduce((acc, curr) => acc + curr, 0)
}

describe(`day ${day}`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

  describe('part 1 test', async () => {
    test('answer', async () => {
      const answer = await solve(linesTest)
      expect(answer).toBe(3);
    })
	})
  describe('part 1 prod', async () => {
    test('answer', async () => {
      const answer = await solve(linesProd)
      expect(answer).not.toBe(-2970);
      expect(answer).toBe(14526);
    })
  })

  describe('part 2 test', async () => {
    test('answer', async () => {
      const answer = await solve(linesTest, 811589153, 10)
      expect(answer).toBe(1623178306);
    })
  })

  describe('part 2 prod', async () => {
    test('answer', async () => {
      const answer = await solve(linesProd, 811589153, 10)
      expect(answer).toBe(9738258246847);
    })
  })

})
