import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

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

	// if (!await Bun.file('./activeValves.json').exists()) {

		const activeValves = JSON.parse(JSON.stringify(valves))

		// console.log(activeValves)

		// calculate shortest path between each active valve
		Object.keys(activeValves).forEach((b, count) => {
			console.log('calculating', b, count + 1, '/', Object.keys(activeValves).length)
			Object.keys(activeValves).forEach(e => {
				if (b === e) {
					return
				}
				if (activeValves[b].tunnels[e]) {
					// console.log('already connected', b, e)
					return
				}
				function search(curr: string, visited: string[]) {
					// stop condition
					if (curr === e) {
						return visited.length
					}
					return Math.min(
						...Object.keys(valves[curr].tunnels)
							.filter(t => !visited.includes(t))
							.map(t => search(t, [...visited, t]))
					)
				}

				const min = search(b, [])
				activeValves[b].tunnels[e] = min
			})
		})

		Object.keys(activeValves).forEach(v => {
			Object.keys(activeValves[v].tunnels).forEach(t => {
				if (valves[t].rate === 0) delete activeValves[v].tunnels[t]
			})
		})

	// 	await Bun.write('./activeValves.json', JSON.stringify(activeValves, null, 2))
	// }

	// const activeValves = JSON.parse(await Bun.file('./activeValves.json').text()) as {[key: string]: {tunnels: {[key: string]: number}}}

	// console.log(activeValves)

	const maxDepth = 30

	let cache = Object.create(null) as {[key: string]: number}

	let runningMax = 0

	const calcFlow = (vOrder: {[key: string]: number}) => {
		// const key = Bun.hash(JSON.stringify(vOrder))
		const key = JSON.stringify(vOrder).replace(/[^A-Z\d]/g, '')
		// const key = Object.keys(vOrder).map(k => `${k[0]}${vOrder[k]}`).join('')
		return cache[key] || (() => {
			const res = Object.keys(vOrder).reduce((acc, curr) => acc + valves[curr].rate * (maxDepth - vOrder[curr]), 0)
			cache[key] = res
			if (res > runningMax) runningMax = res
			// if (cache.size % 10 === 0) {
			// console.log(
			// 	Object.keys(cache).length,
			// 	pad(res, 5),
			// 	pad(runningMax, 5),
			// 	((Bun.nanoseconds() - start)/1e9/60).toFixed(2) + 'm',
			// 	pad(key, 30)
			// )
			// }
			return res
		})()
	}

	const visitable = Object.keys(activeValves).filter(i => valves[i].rate !== 0).length

	function search(depth: number, v: string, vOrder: {[key: string]: number}) {
		// console.log('search', depth, v, vOrder)
		if (depth >= maxDepth) {
			const res = calcFlow(vOrder)
			// console.log('max depth reached', res)
			return res
		}
		if (Object.keys(cache).length > 2000) return runningMax
		if (Object.keys(vOrder).length === visitable) {
			const res = calcFlow(vOrder)
			// console.log('all visited', res)
			return res
		}
		if (!vOrder[v] && valves[v].rate !== 0){
			return Math.max(
				search(depth+1, v, {...vOrder, [v]: depth+1}),
				...Object.keys(activeValves[v].tunnels)
					.filter(t => !Object.keys(vOrder).includes(t))
					// .toSorted((a, b) => valves[b].rate - valves[a].rate)
					.filter(t => depth+activeValves[v].tunnels[t] < maxDepth - 0)
					.map(t => search(depth+activeValves[v].tunnels[t], t, vOrder))
			) // open valve, or move to next valve
		}
		return Math.max(
			...Object.keys(activeValves[v].tunnels)
				.filter(t => !Object.keys(vOrder).includes(t))
				// .toSorted((a, b) => valves[b].rate - valves[a].rate)
				.filter(t => depth+activeValves[v].tunnels[t] < maxDepth - 0)
				.map(t => search(depth+activeValves[v].tunnels[t], t, vOrder))
		) // move to next valve
	}

	return Math.max(...Object.keys(activeValves).map(v => {cache = Object.create(null); return search(1, v, {})}))

	// return search(1, 'LW', {})
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
