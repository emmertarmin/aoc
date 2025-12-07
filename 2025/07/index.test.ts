// @ts-ignore: bun-test-ignore-file
import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

async function solve(lines: string[]) {
	let sum = 0
  const levels: string[] = []

	for (const line of lines) {
		levels.push(line.replace(/S/g, '|'))
	}

  let prev = levels[0]

  levels.slice(1).forEach(level => {
    const virtualLevel = level.split('')
    for (let i = 0; i < level.length; i++) {
      if (prev[i] === '|') {
        if (level[i] === '^') {
          sum++
          virtualLevel[i-1] = '|'
          virtualLevel[i+1] = '|'
        } else if (level[i] === '.') {
          virtualLevel[i] = '|'
        }
      }
    }
    prev = virtualLevel.join('')
  })

	return sum
}

function stringReplaceAt(str: string, index: number, char: string) {
  return str.substring(0, index) + char + str.substring(index + 1);
}

const cache = new Map<string, number>()

async function solveB(lines: string[]) {
	let sum = 0
  const levels: string[] = []

	for (const line of lines) {
		levels.push(line.replace(/S/g, '|'))
	}

  let prev = levels[0]

  const paths = new Set<string>()

  function rec(curr: string, prev: string, depth: number, path: string): number {
    // exit condition
    if (depth >= levels.length) {
      // console.log(path)
      return 1 // found one unique, valid path
    }

    const beam = prev.indexOf('|')

    const cacheKey = `${depth}-${beam}`
    if (cache.has(cacheKey)) {
      // this exacte state was reached before, the remaining unique paths from here on forward are known
      return cache.get(cacheKey)!
    }

    if (curr[beam] === '^') {
      const goLeft = rec(levels[depth + 1], stringReplaceAt(curr, beam - 1, '|'), depth + 1, path + 'L')
      const goRight = rec(levels[depth + 1], stringReplaceAt(curr, beam + 1, '|'), depth + 1, path + 'R')
      const result = goLeft + goRight
      cache.set(cacheKey, result)
      return result
    } else if (curr[beam] === '.') {
      const result = rec(levels[depth + 1], stringReplaceAt(curr, beam, '|'), depth + 1, path + 'S')
      cache.set(cacheKey, result)
      return result
    }
  }

	return rec(levels[1], levels[0], 0, '')
}

describe(`2025/07`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(21)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(1550)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solveB(linesTest)
			expect(answer).toBe(40)
		})

		test('PROD', async () => {
			const answer = await solveB(linesProd)
			expect(answer).toBe(9897897326778)
		})
	})
})
