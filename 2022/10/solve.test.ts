import { describe, expect, test } from 'bun:test'
import { getLines, readFileLineByLine } from '@/io'

const day = '10'

describe(`day ${day}`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	function solve1() {
		let cycle = 0
		let x = 1
		let sum = 0
		let poi = [20, 60, 100, 140, 180, 220]

		const next = () => {
			cycle++
			if (poi.includes(cycle)) {
				sum += cycle*x
				console.log(cycle*x)
			}
		}

		const r = /^addx (?<arg>[0-9\-]+)$/

		for (const line of lines) {
			if (line === 'noop') { next(); continue }
			if (r.test(line)) {
				next()
				next()
				x += parseInt(/^addx (?<arg>[0-9\-]+)$/.exec(line).groups.arg)
				continue
			}
		}


		return sum
	}

	test('answer 1', async () => {
		expect(solve1()).toBe(12460);
	})

	async function solve2() {
		let cycle = 0
		let x = 2
		let px = new Set<number>()

		function print() {
			let str = ''
			for (let i = 1; i <= 240; i++) {
				let curr = ' '
				if (px.has(i)) curr = '#'
				// if (Math.abs(cycle%40 - i%40) <= 1) curr = '-'
				// if (px.has(i) && Math.abs(cycle%40 - i%40) <= 1) curr = '+'
				str += curr
				// if (i % 40 === 0) str += '\n'
			}
			for (let i = 0; i < 6; i++) {
				console.log(str.slice(i*40, (i + 1)*40))
			}
			console.log('\n')
		}

		const next = async () => {
			// await new Promise(r => setTimeout(r, 200))
			cycle = cycle + 1

			// print()

			if (Math.abs(cycle%40 - x%40) <= 1) {
				px.add(cycle)
			}
		}

		const r = /^addx (?<arg>[0-9\-]+)$/

		for (let index = 0; index < lines.length; index++) {
			const line = lines[index%lines.length]
			if (line === 'noop') { await next(); continue }
			if (r.test(line)) {
				await next()
				await next()
				x += parseInt(/^addx (?<arg>[0-9\-]+)$/.exec(line).groups.arg)
				continue
			}
		}

		print()

		return 0
	}

	test('answer 1', async () => {
		expect(await solve2()).toBe(0); // Answer is the following printed letters: EZFPRAKL
	})
})
