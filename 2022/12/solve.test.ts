import { describe, expect, test } from 'bun:test'
import { getLines, readFileLineByLine } from '@/io'

const day = '12'

describe(`day ${day}`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	type Point = {
		x: number,
		y: number,
		parent?: Point,
		score?: number
	}

	async function solve(start: Point = {x: 0, y: 0}) {
		const grid = [];

		let end: Point = {x: 0, y: 0}

		for (let y = 0; y < lines.length; y++) {
      console.log(lines)
			const line = lines[y]
			grid.push(line.split(''))
			if (line.includes('E')) {
				end = {x: line.indexOf('E'), y}
			}
		}

		// grid[start.y][start.x] = 'a'
		// grid[end.y][end.x] = 'z'

		const getNeighbors = (point: Point) => {
			const neighbors = []
			if (point.x > 0) neighbors.push({x: point.x - 1, y: point.y})
			if (point.x < grid[0].length - 1) neighbors.push({x: point.x + 1, y: point.y})
			if (point.y > 0) neighbors.push({x: point.x, y: point.y - 1})
			if (point.y < grid.length - 1) neighbors.push({x: point.x, y: point.y + 1})
			return neighbors
		}

		const getElevation = (point: Point) => grid[point.y][point.x].replace('S', 'a').replace('E','z').charCodeAt(0) - 'a'.charCodeAt(0)

		const getCost = (a: Point, b: Point) => getElevation(b) - getElevation(a)

		const print = (points: Point[] = []) => {
			let str = grid[0].map(c => '-').join('') + '\n'
			for (let y = 0; y < grid.length; y++) {
				for (let x = 0; x < grid[y].length; x++) {
					const p = points.find(p => p.x === x && p.y === y)
					if (p) {
						str += '.'
					} else {
						str += grid[y][x]
					}
				}
				str += '\n'
			}
			str += grid[0].map(c => '-').join('') + '\n'
			// process.stdout.moveCursor(0, - grid.length - 2)
			process.stdout.write(str)

		}

		const encode = (point: Point) => `${point.x},${point.y}`

		const shift = (list: {[key: string]: Point}) => {
			const first = Object.values(list).sort((a, b) => b.score - a.score)[0]
			delete list[encode(first)]
			return first
		}

		let openList: {[key: string]: Point} = {[encode(start)]: {...start, score: 0}}
		let closedList: {[key: string]: Point} = {}
		let solution: Point[] = []

		// print()

		let index = 0

		while (Object.keys(openList).length > 0) {
			index++
			const current = shift(openList)
			closedList[encode(current)] = current
			if (current.x === end.x && current.y === end.y) {
				let c = current
				while (c.parent) {
					solution.push(c)
					c = c.parent
				}
				console.log('found', solution.length)
				// print(solution)
				return solution.length
			}
			const neighbors = getNeighbors(current)
			for (const neighbor of neighbors.filter(nb => getCost(current, nb) <= 1)) {
				if (closedList[encode(neighbor)]) {
					continue
				}
				if (!openList[encode(neighbor)]) {
					neighbor.parent = current
					neighbor.score = current.score + getCost(current, neighbor)
					openList[encode(neighbor)] = neighbor
				} else if (current.score + getCost(current, neighbor) < neighbor.score) {
					neighbor.parent = current
					neighbor.score = current.score + getCost(current, neighbor)
					openList[encode(neighbor)] = neighbor
				}
			}
			// if (index % 1 === 0) {
			// 	let chain = []
			// 	let c = current
			// 	while (c.parent) {
			// 		chain.push(c)
			// 		c = c.parent
			// 	}
			// 	print(chain)
			// 	await new Promise(r => setTimeout(r, 200))
			// }
		}

		return Infinity
	}

	test('answer 1', async () => {
		expect(await solve()).toBe(330);
	})

	test('answer 2', async () => {
		const starts = lines.map((line, y) => {
			line = line.replace('S', 'a')
			return line.split('').map((c, x) => {
				if (c === 'a') {
					return {x, y} as Point
				}
				return null
			})
		}).flat().filter(Boolean)
		// console.log(starts)
		let min = Infinity
		for (const start of starts) {
			const l = await solve(start)
			min = Math.min(min, l)
		}
		expect(min).toBe(321);
	})
})
