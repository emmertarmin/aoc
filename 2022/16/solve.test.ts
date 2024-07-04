import { describe, expect, test } from 'bun:test'
import { getLines, readFileLineByLine } from '@/io'

const day = '16'

type Valve = {
	rate: number,
	tunnels: {[key: string]: number}
}

async function solve(lines: string[]) {
	const valves: {[key: string]: Valve} = {}
	lines.forEach(line => {
		const {name, rate, tunnels} = line
			.match(/^Valve (?<name>\w+) has flow rate=(?<rate>\d+); tunnels? leads? to valves? (?<tunnels>.*)$/).groups
		valves[name] = {
			rate: parseInt(rate),
			tunnels: {}
		}
		if (tunnels.includes(', ')) {
			tunnels.split(', ').forEach(t => {
				valves[name].tunnels[t] = 1
			})
		} else {
			valves[name].tunnels[tunnels] = 1
		}
	})

	// console.log(valves)

	const activeValves = {...valves}
	Object.keys(valves).forEach(v => {
		if (valves[v].rate === 0) {
			Object.keys(activeValves).forEach(t => {
				delete activeValves[t].tunnels[v]
			})
			delete activeValves[v]
		}
	})

	// calculate shortest path between each active valve
	Object.keys(activeValves).forEach(b => {
		Object.keys(activeValves).forEach(e => {
			if (b === e) return
			if (activeValves[b].tunnels[e]) return
			const queue = Object.keys(activeValves).filter(t => t !== b)
			const visited = new Map<string, number>()
			let depth = 0
			while (queue.length > 0) {
				const curr = queue.shift()
				depth++
				if (visited.has(curr) && visited.get(curr) <= depth) continue
				visited.set(curr, depth)
				if (activeValves[curr].tunnels[e]) {
					activeValves[b].tunnels[e] = depth
					break
				}
				Object.keys(valves[curr].tunnels)
					.filter(t => t !== b)
					.forEach(t => queue.push(t))
			}
			activeValves[b].tunnels[e] = visited.get(e)
		})
	})

	console.log(activeValves)

	const maxDepth = 30

	const cache = new Map<string, number>()

	const calcFlow = (vOrder: {[key: string]: number}) => {
		const key = Object.keys(vOrder).sort().map(k => `${k[0]}:${vOrder[k]}`).join(',')
		if (cache.has(key)) return cache.get(key)
		const res = Object.keys(vOrder).reduce((acc, curr) => acc + valves[curr].rate * (maxDepth - vOrder[curr]), 0)
		cache.set(key, res)
		if (cache.size % 1000 === 0) console.log(cache.size)
		return res
	}

	function search(depth: number, v: string, vOrder: {[key: string]: number}) {
		if (depth >= maxDepth) {
			const res = calcFlow(vOrder)
			// console.log('max depth reached', res)
			return res
		}
		if (Object.keys(valves).filter(i => valves[i].rate !== 0).every(i => Object.keys(vOrder).includes(i))) {
			const res = calcFlow(vOrder)
			console.log('all valves are open', res)
			return res
		}
		const options = valves[v].tunnels.map(t => search(depth+1, t, vOrder))
		if (!vOrder[v] && valves[v].rate !== 0) {
			return Math.max(search(depth+1, v, {...vOrder, [v]: depth+1}), ...options)
		}
		return Math.max(...options)
	}

	return search(0, 'AA', {})
}

describe(`day ${day} test`, async () => {
	const lines = await getLines(`${import.meta.dir}/test1.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(lines)).toBe(1651);
	})

	test('answer 2', async () => {
		expect(await solve(lines)).toBe(56000011);
	})
})

describe(`day ${day} prod`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(lines)).toBe(5166077);
	})

	test('answer 2', async () => {
		expect(await solve(lines)).toBe(13071206703981);
	})
})
