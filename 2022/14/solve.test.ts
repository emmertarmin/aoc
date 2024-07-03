import { describe, expect, test } from 'bun:test'
import { getLines, readFileLineByLine } from '@/io'

const day = '14'

type Point = {x: number, y: number}

async function solve(lines: string[], hasFloor = false) {
	let walls = []
	let lowest = -Infinity
	for (const line of lines) {
		const points: Point[] = line.split(' -> ').map(p => {const [x, y] = p.split(','); return {x: parseInt(x), y: parseInt(y)}})
		points.forEach((point, i) => {
			if (point.y > lowest) lowest = point.y
			if (i === 0) return
			const [start, end] = [points[i - 1], point].toSorted((a, b) => a.x - b.x).toSorted((a, b) => a.y - b.y)
			walls.push([start, end])
		})
	}

	// console.log(walls)

	let wallCache = new Map<string, boolean>()

	function isWall(p: Point) {
		const key = encode(p)
		if (wallCache.has(key)) return wallCache.get(key)
		const isDiscreteWall = walls.some(([start, end]) => {
			return p.x >= start.x && p.x <= end.x && p.y >= start.y && p.y <= end.y
		})
		const isFloor = p.y === lowest + 2
		const answer = isDiscreteWall || (hasFloor && isFloor)
		wallCache.set(key, answer)
		return answer
	}

	const encode = (p: Point) => `${p.x},${p.y}`
	const decode = (s: string) => ({x: parseInt(s.split(',')[0]), y: parseInt(s.split(',')[1])})

	// console.log(wallNodes)

	const grains = new Set<string>()

	const move = (a: Point, b: Point) => ({x: a.x + b.x, y: a.y + b.y})

	function canFall(sand: Point) {
		return [{x: 0, y: 1}, {x: -1, y: 1}, {x: 1, y: 1}]
			.filter(o => !isWall(move(sand, o)))
			.filter(o => !grains.has(encode(move(sand, o))))
	}

	function grain () {
		let sand = {x: 500, y: 0}
		while (canFall(sand).length > 0 && sand.y <= lowest) {
			sand = move(sand, canFall(sand)[0])
		}
		if (!hasFloor && sand.y > lowest) return null
		if (hasFloor && sand.y === 0) {
			grains.add(encode(sand))
			return null
		}
		grains.add(encode(sand))
		return sand
	}

	let sand = grain();
	while (!!sand) {
		sand = grain()
		if (!sand) return grains.size
	}

	return 0
}

describe(`day ${day} test`, async () => {
	const lines = await getLines(`${import.meta.dir}/test1.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(lines)).toBe(24);
	})

	test('answer 2', async () => {
		expect(await solve(lines, true)).toBe(93);
	})
})

describe(`day ${day} prod`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(lines)).toBe(779);
	})

	test('answer 2', async () => {
		expect(await solve(lines, true)).toBe(27426);
	})
})
