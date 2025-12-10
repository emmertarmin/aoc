// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

class Node {
	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	x: number
	y: number
	z: number

	distanceTo(other: Node) {
		return Math.sqrt((this.x - other.x)*(this.x - other.x) + (this.y - other.y)*(this.y - other.y) + (this.z - other.z)*(this.z - other.z))
	}

	print() {
		return `(${this.x} ${this.y} ${this.z})`
	}
}

let nodes: Node[] = []

let circuits: number[][] = []

function connect(a: number, b: number): boolean {
	const ca = circuits.findIndex(c => c.includes(a))!
	const cb = circuits.findIndex(c => c.includes(b))!

	// already connected
	if (ca === cb) {
		// console.log('🟡 Already connected')
		return false
	}

	// connect circuits
	circuits[ca] = [...circuits[ca], ...circuits[cb]]
	circuits.splice(cb, 1)

	// console.log('🟢 Connected', a, b)


	return true
}

async function solve(lines: string[], connstraint: number): Promise<number> {
	// initialize nodes
	nodes = []
	for (const line of lines) {
		const [x, y, z] = line.split(',').map(Number)
		nodes.push(new Node(x, y, z))
	}

	// initialize circuits
	circuits = [...nodes.map((_, i) => [i])]

	// calculate distances
	const distances: {d: number, nodes: number[]}[] = []
	for (let i = 0; i < nodes.length; i++) {
		for (let j = i + 1; j < nodes.length; j++) {
			if (i === j) continue
			distances.push({d: nodes[i].distanceTo(nodes[j]), nodes: [i, j]})
		}
	}
	distances.sort((a, b) => a.d - b.d)

	// iterate over distances and connect nodes
	for (let i = 0; i < connstraint; i++) {
		connect(distances[i].nodes[0], distances[i].nodes[1]) ? 1 : 0
	}

	circuits.sort((a, b) => b.length - a.length)

	return circuits
		.toSorted((a, b) => b.length - a.length)
		.slice(0, 3)
		.map(c => c.length)
		.reduce((acc, cur) => acc * cur, 1)
}

async function solveB(lines: string[]): Promise<number> {
	// initialize nodes
	nodes = []
	for (const line of lines) {
		const [x, y, z] = line.split(',').map(Number)
		nodes.push(new Node(x, y, z))
	}

	// initialize circuits
	circuits = [...nodes.map((_, i) => [i])]

	// calculate distances
	const distances: {d: number, nodes: number[]}[] = []
	for (let i = 0; i < nodes.length; i++) {
		for (let j = i + 1; j < nodes.length; j++) {
			if (i === j) continue
			distances.push({d: nodes[i].distanceTo(nodes[j]), nodes: [i, j]})
		}
	}
	distances.sort((a, b) => a.d - b.d)

	// iterate over distances and connect nodes
	for (let i = 0; i < distances.length; i++) {
		const n0 = distances[i].nodes[0]
		const n1 = distances[i].nodes[1]
		connect(n0, n1)
		if (circuits.length === 1) {
			return nodes[n0].x * nodes[n1].x
		}
	}
}

describe(`AoC`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('TEST', async () => {
			const answer = await solve(linesTest, 10)
			expect(answer).toBe(40)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, 1000)
			expect(answer).toBeGreaterThan(11040)
			expect(answer).toBeGreaterThan(12100)
			expect(answer).toBe(131580)
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solveB(linesTest)
			expect(answer).toBe(25272)
		})

		test('PROD', async () => {
			const answer = await solveB(linesProd)
			expect(answer).toBe(6844224)
		})
	})
})
