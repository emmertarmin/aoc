import { describe, expect, test } from 'bun:test'
import { getLines, readFileLineByLine } from '@/io'
import { type V3, isNeighbor, getNeighbors } from '@/vector3d'

const day = '18'

function print(arr: V3[], dim1: keyof V3, dim2: keyof V3) {
	const min1 = Math.min(...arr.map(v => v[dim1]))
	const max1 = Math.max(...arr.map(v => v[dim1]))
	const min2 = Math.min(...arr.map(v => v[dim2]))
	const max2 = Math.max(...arr.map(v => v[dim2]))
	const depth1 = Math.min(...arr.map(v => v[['x','y','z'].find(key => key !== dim1 && key !== dim2)]))
	const depth2 = Math.max(...arr.map(v => v[['x','y','z'].find(key => key !== dim1 && key !== dim2)]))

	for (let d = depth1; d <= depth2; d++) {
		const grid: string[][] = Array.from({length: max2 - min2 + 1}, () => Array.from({length: max1 - min1 + 1}, () => '.'))

		arr.filter(v => v[['x','y','z'].find(key => key !== dim1 && key !== dim2)] === d).forEach(v => {
			grid[v[dim2] - min2][v[dim1] - min1] = '#'
		})

		console.log(grid.map(row => row.join('')).join('\n'))
	}
}

async function solve(lines: string[], includeTrappedAir = false) {
	const dropSet = new Set<string>()

	let surface = 0

	for (const line of lines) {
		const [x, y, z] = line.split(',').map(Number)
		dropSet.add(`${x},${y},${z}`)
	}

	const set2v = (set: Set<string>) => Array.from(set).map(drop => drop.split(',').map(Number)).map(([x, y, z]) => ({x, y, z}))
	const str2v = (str: string) => [str].map(s => s.split(',').map(Number)).map(([x, y, z]) => ({x, y, z}))[0]
	const v2str = (v: V3) => `${v.x},${v.y},${v.z}`


	let drops: V3[] = set2v(dropSet)

	if (includeTrappedAir) {
		const openSet = new Set<string>()

		function isLava (v: V3) {
			const answer = dropSet.has(v2str(v))
			return answer
		}

		function isOpen (v: V3) {
			if (isLava(v)) return false
			if (openSet.has(v2str(v))) return true
			if (getNeighbors(v).some(neighbor => openSet.has(`${neighbor.x},${neighbor.y},${neighbor.z}`)) && !isLava(v)) return true
			if (!drops.some(drop => drop.x > v.x && drop.y === v.y && drop.z === v.z) && !drops.some(drop => drop.x < v.x && drop.y === v.y && drop.z === v.z)) return true
			if (!drops.some(drop => drop.x === v.x && drop.y > v.y && drop.z === v.z) && !drops.some(drop => drop.x === v.x && drop.y < v.y && drop.z === v.z)) return true
			if (!drops.some(drop => drop.x === v.x && drop.y === v.y && drop.z > v.z) && !drops.some(drop => drop.x === v.x && drop.y === v.y && drop.z < v.z)) return true
			return false
		}

		const minX = Math.min(...drops.map(drop => drop.x)) - 2
		const maxX = Math.max(...drops.map(drop => drop.x)) + 2
		const minY = Math.min(...drops.map(drop => drop.y)) - 2
		const maxY = Math.max(...drops.map(drop => drop.y)) + 2
		const minZ = Math.min(...drops.map(drop => drop.z)) - 2
		const maxZ = Math.max(...drops.map(drop => drop.z)) + 2

		const queue = new Set<string>([`${minX},${minY},${minZ}`])
		const closed = new Set<string>()

		let prevState = ''

		while (prevState !== `${queue.size},${closed.size}`) {
			prevState = `${queue.size},${closed.size}`
			Array.from(queue).map(v => {
				if (isOpen(str2v(v))) {openSet.add(v)}
				closed.add(v)
			})
			const nb = Array.from(queue)
				.flatMap(v => getNeighbors(str2v(v)))
				.filter(v => v.x >= minX && v.x <= maxX && v.y >= minY && v.y <= maxY && v.z >= minZ && v.z <= maxZ)
				.map(v2str)
				.filter(v => !closed.has(v))
				.filter(v => !queue.has(v))
			nb.forEach(v => queue.add(v))

			// await new Promise(resolve => setTimeout(resolve, 100))

			// console.log(queue.size, closed.size)
		}

		for (let x = minX + 1; x <= maxX - 1; x++) {
			for (let y = minY + 1; y <= maxY - 1; y++) {
				for (let z = minZ + 1; z <= maxZ - 1; z++) {
					const vStr = `${x},${y},${z}`
					if (!openSet.has(vStr)) {
						dropSet.add(vStr)
					}
				}
			}
		}
	}

	drops = set2v(dropSet)

	drops.forEach(drop => {
		const neighbors = getNeighbors(drop).filter(neighbor => dropSet.has(`${neighbor.x},${neighbor.y},${neighbor.z}`))
		surface += 6 - neighbors.length
	})

	// print(drops, 'x', 'z')

	return surface
}

describe(`day ${day} test`, async () => {
	const lines = await getLines(`${import.meta.dir}/test1.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(['1,1,1', '2,1,1'])).toBe(10);
	})

	test('answer 1', async () => {
		expect(await solve(lines)).toBe(64);
	})

	test('answer 2', async () => {
		expect(await solve(lines, true)).toBe(58);
	})
})

describe(`day ${day} prod`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	test('answer 1', async () => {
		expect(await solve(lines)).toBe(4390);
	})

	test('answer 2', async () => {
		const answer = await solve(lines, true)
		expect(answer).toBeLessThan(4390);
		expect(answer).toBeGreaterThan(2090);
		expect(answer).toBe(2534);
	})
})
