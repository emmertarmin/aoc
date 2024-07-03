import { describe, expect, test } from 'bun:test'
import { getLines, readFileLineByLine } from '@/io'

const day = '15'

type Point = {
	x: number,
	y: number,
}

type Sensor = Point & {
	distance: number
}

async function solve(lines: string[], loi: number) {
	const sensors: Sensor[] = []

	const distManhattan = (a: Point, b: Point) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

	lines.forEach(line => {
		const {x, y, a, b} = line.match(/^Sensor at x=(?<x>[\d-]+), y=(?<y>[\d-]+): closest beacon is at x=(?<a>[\d-]+), y=(?<b>[\d-]+)/).groups
		sensors.push({
			x: parseInt(x),
			y: parseInt(y),
			beacon: {x: parseInt(a), y: parseInt(b)}
		})
	})

	// sensors.push({x: 8, y: 7, beacon: {x: 2, y: 10}})

	const notBeacon = new Set<number>()

	sensors.forEach(sensor => {
		let dist = distManhattan(sensor, sensor.beacon)
		const left = sensor.x - (dist - (Math.abs(sensor.y - loi)))
		const right = sensor.x + (dist - (Math.abs(sensor.y - loi)))
		for (let i = left; i <= right; i++) {
			if (!sensors.some(s => s.x === i && s.y === loi)
				&& !sensors.some(s => s.beacon.x === i && s.beacon.y === loi)
			) {
				notBeacon.add(i)
			}
		}
	})

	// console.log(Array.from(notBeacon).sort((a, b) => a - b))
	// console.log(notBeacon.size)

	return notBeacon.size
}

async function solve2(lines: string[], limit: number) {
	const sensors: Sensor[] = []

	const distManhattan = (a: Point, b: Point) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

	const getTuningFrequency = (p: Point) => p.x * 4000000 + p.y

	lines.forEach(line => {
		const {x, y, a, b} = line.match(/^Sensor at x=(?<x>[\d-]+), y=(?<y>[\d-]+): closest beacon is at x=(?<a>[\d-]+), y=(?<b>[\d-]+)/).groups
		sensors.push({
			x: parseInt(x),
			y: parseInt(y),
			distance: distManhattan({x: parseInt(x), y: parseInt(y)}, {x: parseInt(a), y: parseInt(b)})
		})
	})

	function isFoundBySensor(point: Point) {
		return sensors.some(sensor => {
			return distManhattan(sensor, point) <= sensor.distance
		})
	}

	// let grid: string[][] = Array.from({length: limit + 1}, (_, y) => Array.from({length: limit + 1}, (_, x) => isFoundBySensor({x, y}) ? '#' : '.'))
	// console.log(grid.map(row => row.join('')).join('\n') + '\n')

	function getBorderOfSensor(sensor: Sensor): Point[] {
		const top = {x: sensor.x, y: sensor.y - (sensor.distance + 1)}
		const bottom = {x: sensor.x, y: sensor.y + (sensor.distance + 1)}

		const edgeTopLeft = (x: number) => ({x: x, y: x - sensor.x + top.y})
		const edgeTopRight = (x: number) => ({x: x, y: -x + sensor.x + top.y})
		const edgeBottomRight = (x: number) => ({x: x, y: x - sensor.x + bottom.y})
		const edgeBottomLeft = (x: number) => ({x: x, y: -x + sensor.x + bottom.y})

		let points: Point[] = []

		for (let x = 0; x <= limit; x++) {
			const candidates = [edgeTopLeft(x), edgeTopRight(x), edgeBottomRight(x), edgeBottomLeft(x)]
			points.push(...candidates
				.filter(point => point.y >= 0 && point.y <= limit)
				.filter(point => distManhattan(sensor, point) === sensor.distance + 1)
			)
		}

		// points.forEach(point => {
		// 	if (grid[point.y] && grid[point.y][point.x]) grid[point.y][point.x] = 'o'
		// })
		// console.log(grid.map(row => row.join('')).join('\n') + '\n')
		// grid = Array.from({length: limit + 1}, (_, y) => Array.from({length: limit + 1}, (_, x) => isFoundBySensor({x, y}) ? '#' : '.'))

		return points
	}

	for (let i = 0; i < sensors.length; i++) {
		console.log(`Testing sensor ${i + 1}`)
		const borderPoints = getBorderOfSensor(sensors[i])
		const result = borderPoints.find(point => !isFoundBySensor(point))
		if (result) {
			console.log(result)
			return getTuningFrequency(result)
		}
	}

	return -1
}

describe(`day ${day} test`, async () => {
	const lines = await getLines(`${import.meta.dir}/test1.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(lines, 10)).toBe(26);
	})

	test('answer 2', async () => {
		expect(await solve2(lines, 20)).toBe(56000011);
	})
})

describe(`day ${day} prod`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(lines, 2000000)).toBe(5166077);
	})

	test('answer 2', async () => {
		expect(await solve2(lines, 4000000)).toBe(13071206703981);
	})
})
