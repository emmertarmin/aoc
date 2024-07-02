import { describe, expect, test } from 'bun:test'
import { getLines, readFileLineByLine } from '@/io'

const day = '09'

describe(`day ${day}`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`)

	type V = {x: number, y: number}

	function getVisitedByTail(n = 1) {
		let head: V = {x: 0, y: 0}
		let tail: V[] = Array.from({length: n}, (_, i) => ({x: 0, y:0}))

		const visited = new Set<string>([`${tail[tail.length - 1].x},${tail[tail.length - 1].y}`])

		const add = (a: V, b: V) => {
			return {x: a.x + b.x, y: a.y + b.y}
		}

		const sub = (a: V, b: V) => {
			return {x: a.x - b.x, y: a.y - b.y}
		}

		const isAdjacent = (a: V, b: V) => {
			return Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1
		}

		const pull = (from: V, to: V) => {
			const diff = sub(from, to)
			return {x: Math.sign(diff.x), y: Math.sign(diff.y)}
		}

		lines.forEach(line => {
			const {dir, dist} = line.match(/(?<dir>\w) (?<dist>\d+)/).groups
			const vector: V = {U: {x: 0, y: -1}, D: {x: 0, y: 1}, R: {x: 1, y: 0}, L: {x: -1, y: 0}}[dir]
			for (let i = 0; i < parseInt(dist); i++) {
				head = add(head, vector)
				for (let j = 0; j < tail.length; j++) {
					let h = head
					if (j > 0) h = tail[j - 1]
					if (isAdjacent(h, tail[j])) continue
					tail[j] = add(tail[j], pull(h, tail[j]))
					if (j === tail.length - 1) visited.add(`${tail[j].x},${tail[j].y}`)
				}
			}

		})

		return visited.size
	}

	// console.log(visited)

	test('answer 1', async () => {
		expect(getVisitedByTail(1)).toBe(6384);
	})

	test('answer 2', async () => {
		expect(getVisitedByTail(9)).toBe(2734);
	})
})
