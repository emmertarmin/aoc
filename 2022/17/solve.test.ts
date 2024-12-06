import { describe, expect, test } from 'bun:test'
import { getLines, readFileLineByLine } from '@/io'
import { type V, add, isAdjacent, intersection, sub } from '@/vector'

const day = '17'

async function solve(lines: string[], iterations: number) {
	// console.log(lines.join('\n'))

	function* rocksGenerator(): Generator<{rock: V[], index: number}> {
		const arr: V[][] = [
			[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
			[{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
			[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
			[{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
			[{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }]
		]
		let i = 0
		while (true) {
			yield {rock: arr[i], index: i}
			i++
			if (i === arr.length) i = 0
		}
	}

	function* windGenerator(): Generator<{wind: V, index: number}> {
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
			yield {wind: arr[i], index: i}
			i++
			if (i === arr.length) i = 0
		}
	}

	function moveRock(rock: V[], wind: V): V[] {
		return rock.map(point => add(point, wind))
	}

	let solids = Object.create(null)

	function collides(a: V[]) {
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

	const cycles = new Map<string, any>()

	function getSurface() {
		const keys = Object.keys(solids).map(key => key.split(',').map(Number))
		const surface: V[] = []
		for (let j = 0; j < 7; j++) {
			const maxY = Math.max(...keys.filter(([x, y]) => x === j).map(([x, y]) => y))
			surface.push({ x: j, y: maxY })
		}
		const minY = Math.min(...surface.map(p => p.y))
		return Object.keys(solids).filter(key => parseInt(key.split(',')[1]) >= minY).map(key => key.split(',').map(Number)).map(([x, y]) => ({x, y}))
	}

	function getHash(rockI: number, windI: number, rock0pos: number, surface: V[]) {
		surface.sort((a, b) => a.x - b.x)
		surface.sort((a, b) => a.y - b.y)
		const startPoint = surface[0]
		const surfaceNormalized = surface
			.map(point => ({x: point.x, y: point.y - startPoint.y}))
		return `${rockI},${windI},${rock0pos}${Bun.hash(JSON.stringify(surfaceNormalized))}`
	}

	let cyclingDone = false

	async function handleRock(shape: V[], rockIndex: number, currIndex: number) {
		const startOffset = { x: 2, y: maxHeight + 3 }
		let rock = shape.map(point => add(point, startOffset))

		// move rock until it falls in place
		let i = 0
		while (true) {
			i++
			const {wind, index: windIndex} = winds.next().value

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

			if (cyclingDone) return 1

			let surface = getSurface()
			const hash = getHash(rockIndex, windIndex, rock.reduce((acc, curr) => Math.min(acc + curr.x), Infinity), surface)
			if (!cycles.has(hash)) {
				cycles.set(hash, {maxHeight, rockIndex, windIndex, surface, index: currIndex})
			} else {
				const cycle = cycles.get(hash)
				let offsetHeight = maxHeight - cycle.maxHeight
				let offsetIndex = currIndex - cycle.index
				console.log('cycle detected', cycle.index, currIndex)
				// console.log('cycle detected', {currIndex, maxHeight, cycleIndex: cycle.index, cycleMaxHeight: cycle.maxHeight})

				let deltaIndex = 1
				let plusIters = Math.floor((iterations - currIndex) / offsetIndex)
				deltaIndex += offsetIndex * plusIters
				maxHeight += offsetHeight * plusIters
				console.log('plusIters', plusIters)
				// console.log('plusIters', {plusIters, deltaIndex, maxHeight})
				surface = surface.map(point => add(point, { x: 0, y: offsetHeight * plusIters }))
				solids = Object.create(null)
				surface.forEach(point => solids[point.x + ',' + point.y] = true)
				cyclingDone = true
				return deltaIndex
			}

			break
		}

		//rock fell in place

		return 1
	}

	let i = 0
	while (i < iterations) {
		const {rock, index: rockIndex} = rocks.next().value
		const step = await handleRock(rock, rockIndex, i)
		i += step
		if (step > 1) console.log(step)
		// await new Promise(resolve => setTimeout(resolve, 10))
	}

	return maxHeight
}

describe(`day ${day} test`, async () => {
	const lines = await getLines(`${import.meta.dir}/test1.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(lines, 2022)).toBe(3068);
	})

	test('answer 2', async () => {
		expect(await solve(lines, 1000*1000*1000*1000)).toBe(1514285714288);
	})
})

describe(`day ${day} prod`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(lines, 2022)).toBe(3157);
	})

	test('answer 2', async () => {
		expect(await solve(lines, 1000*1000*1000*1000)).not.toBe(1558017492763);
		expect(await solve(lines, 1000*1000*1000*1000)).toBe(1581449275319);
	})
})
