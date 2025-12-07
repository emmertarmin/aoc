// @ts-ignore: bun-test-ignore-file
import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

function flatten<T>(arr: T[][]): T[] {
	return arr.reduce((acc, val) => acc.concat(val), [])
}

async function solve(lines: string[]) {
	let sum = 0

	let str = lines[0] // there is only a single line

	let layout = flatten(str.split('').map((d, i) => {
		return new Array(Number(d)).fill(i % 2 === 0 ? i / 2 : -1)
	}))

	const digits = layout.filter(d => d !== -1)
	const dLen = digits.length


	// the below mathematical trick makes it run faster, than actually mutating the array
	let r = 0, d = 0
	for (let i = 0; i < dLen; i++) {
		if (layout[i] === -1) {
			sum += i * digits[(dLen - 1) - r]
			r++
		} else {
			sum += i * digits[d]
			d++
		}
	}

	return sum
}

async function solveB(lines: string[]) {
	let str = lines[0] // there is only a single line

	let layout = flatten(str.split('').map((d, i) => {
		return new Array(Number(d)).fill(i % 2 === 0 ? i / 2 : -1)
	}).filter(d => d.length > 0))

	for (let i = (str.length - 1) / 2; i >= 0; i--) {
		const fileSize = layout.filter(d => d === i).length
		for (let j = 0; j < layout.length; j++) {
			if (layout[j] === i) {
				// we reached the current id, so we cannot move it more to the left
				break
			}
			if (layout[j] !== -1) {
				// not free space, we can skip ahead
				continue
			}
			if (layout[j] === -1) {
				let space = 0
				while(layout[j + space] === -1 && space < fileSize) {
					space++
				}
				if (space >= fileSize) {
					// remove file from original space
					layout = layout.map(d => d === i ? -1 : d)
					// insert file in new found space
					for (let k = 0; k < fileSize; k++) {
						layout[j + k] = i
					}
					break
				}
			}
		}
	}

	return layout.reduce((acc, curr, i) => curr < 0 ? acc : acc + i * curr, 0)
}

describe('2024/09', async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(1928)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBeGreaterThan(92625219623)
			expect(answer).toBe(6519155389266)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solveB(linesTest)
			expect(answer).toBe(2858)
		})

		test('PROD', async () => {
			const answer = await solveB(linesProd)
			expect(answer).toBeLessThan(6600118448330)
			expect(answer).toBe(6547228115826)
		})
	})
})
