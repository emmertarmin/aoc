import { describe, expect, test } from 'bun:test'
import { getLines, readFileLineByLine } from '@/io'

const day = '13'

describe(`day ${day}`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	function compare(a: number | any[] | undefined, b: number | any[] | undefined) {
		if (a === undefined) {
			return -1
		}
		if (b === undefined) {
			return 1
		}
		if (typeof a === 'number' && typeof b === 'number') {
			return Math.sign(a - b)
		}
		if (typeof a === 'number' && Array.isArray(b)) {
			return compare([a], b)
		}
		if (Array.isArray(a) && typeof b === 'number') {
			return compare(a, [b])
		}
		if (Array.isArray(a) && Array.isArray(b)) {
			const largerLength = Math.max(a.length, b.length)
			for (let i = 0; i < largerLength; i++) {
				const res = compare(a[i], b[i])
				if (res !== 0) {
					return res
				}
			}
			return 0
		}
	}

	async function solve1() {

		let sum = 0
		for (let i = 0; i < lines.length; i += 2) {
			const right = compare(eval(lines[i]), eval(lines[i+1])) < 1
			// console.log(i/2 + 1, '-', right, '-', lines[i], '-', lines[i+1])
			if (right) sum += i/2 + 1
		}

		return sum
	}

	async function solve2() {
		let l = [...lines, '[[2]]', '[[6]]'].toSorted((a, b) => compare(eval(a), eval(b)))

		return (l.indexOf('[[6]]') + 1) * (l.indexOf('[[2]]') + 1)
	}

	test('answer 1', async () => {
		expect(await solve1()).toBe(6240);
	})

	test('answer 2', async () => {
		expect(await solve2()).toBe(23142);
	})
})
