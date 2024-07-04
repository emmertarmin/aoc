import { describe, expect, test } from 'bun:test'
import { getLines, readFileLineByLine } from '@/io'

const day = '17'

type Point = {
	x: number,
	y: number,
}

async function solve(lines: string[], iterations: bigint) {
	// console.log(lines.join('\n'))

	function* rocksGenerator(): Generator<[Point[], number]> {
		const arr: Point[][] = [
			[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
			[{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
			[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
			[{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
			[{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }]
		]
		let i = 0
		while (true) {
			yield [arr[i], i]
			i++
			if (i === arr.length) i = 0
		}
	}

	function* windGenerator(): Generator<[Point, number]> {
		const arr = lines.filter(Boolean).join('').split('').map(char => {
			switch (char) {
				case '^': return { x: 0, y: -1 }
				case 'v': return { x: 0, y: 1 }
				case '<': return { x: -1, y: 0 }
				case '>': return { x: 1, y: 0 }
			}
		})
		let i = 0
		while (true) {
			yield [arr[i], i]
			i++
			if (i === arr.length) i = 0
		}
	}

	function move(a: Point, b: Point): Point {
		return { x: a.x + b.x, y: a.y + b.y }
	}

	function moveRock(rock: Point[], wind: Point): Point[] {
		return rock.map(point => move(point, wind))
	}

	const solids = Object.create(null)

	function collides(a: Point[]) {
		// wall collision
		if (a.some(point => point.x < 0 || point.y < 0 || point.x > 6)) return true
		// collision with other rocks
		return a.some(point => solids[point.x + ',' + point.y] || false)
	}


	const rocks = rocksGenerator()
	const winds = windGenerator()

	// console.log(rocks.next().value)
	// console.log(wind.next().value)

	let maxHeight = 0
	let offset = 0

	function cleanup() {
		// console.log('cleanup')
		const keys = Object.keys(solids).map(key => key.split(',').map(Number))
		let minY = Infinity
		for (let j = 0; j < 6; j++) {
			const maxY = Math.max(...keys.filter(([x, y]) => x === j).map(([x, y]) => y))
			minY = Math.min(minY, maxY)
		}
		keys.forEach(([x, y]) => {
			if (y < minY) {
				delete solids[x + ',' + y]
			}
		})
		offset += minY

	}

	const cycles = new Map<string, number>()

	function getSurface() {
		const keys = Object.keys(solids).map(key => key.split(',').map(Number))
		const surface: Point[] = []
		for (let j = 0; j < 6; j++) {
			const maxY = Math.max(...keys.filter(([x, y]) => x === j).map(([x, y]) => y))
			surface.push({ x: j, y: maxY })
		}
		return surface
	}

	async function handleRock(shape: Point[], rockIndex: number) {
		const startOffset = { x: 2, y: maxHeight + 3 }
		let rock = shape.map(point => move(point, startOffset))

		let i = 0

		while (true) {
			i++
			if (i % 10000 === 0) {
				cleanup()
			}
			const [wind, windIndex] = winds.next().value

			const h = moveRock(rock, wind)
			if (!collides(h)) {
				rock = h
				// console.log('wind moved rock to', wind.x > 0 ? 'right' : wind.x < 0 ? 'left' : 'nowhere')
			} else {
				// console.log('wind collision')
			}

			const v = moveRock(rock, { x: 0, y: -1 })
			if (!collides(v)) {
				// console.log('gravity moved rock down')
				rock = v
				continue
			} else {
				// console.log('gravity collision')
			}
			rock.forEach(p => solids[p.x + ',' + p.y] = true)
			maxHeight = Math.max(maxHeight, ...rock.map(p => p.y + 1))

			if (!cycles.has(`${windIndex},${rockIndex}`)) {
				cycles.set(`${windIndex},${rockIndex}`, maxHeight)
			} else {
				console.log('cycle detected', cycles.get(`${windIndex},${rockIndex}`), maxHeight)
			}

			break
		}

	}

	for (let i = 0; i < iterations; i++) {
		const [rock, rockIndex] = rocks.next().value as [Point[], number]
		await handleRock(rock, rockIndex)
	}

	return maxHeight
}

describe(`day ${day} test`, async () => {
	const lines = await getLines(`${import.meta.dir}/test1.txt`) as string[]

	test.only('answer 1', async () => {
		expect(await solve(lines, BigInt(2022))).toBe(3068);
	})

	test.only('answer 2', async () => {
		expect(await solve(lines, BigInt(1000*200))).toBe(0);
	})
})

describe(`day ${day} prod`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(lines, BigInt(2022))).toBe(3157);
	})

	test('answer 2', async () => {
		expect(await solve(lines, BigInt(1000000000000))).toBe(0);
	})
})
