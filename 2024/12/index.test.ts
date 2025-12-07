// bun test ./2024/template --watch

import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

type Grid = {
	value: string
	visited: boolean
	nb?: any[]
}[][]

function findNextUnvisited(grid: Grid) {
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (!grid[row][col].visited) {
				return `${row},${col}`
			}
		}
	}
	return null
}

function isInBounds(grid: Grid, row: number, col: number) {
	return row >= 0 && row < grid.length && col >= 0 && col < grid[row].length
}

const nb = [[-1, 0], [1, 0], [0, -1], [0, 1]]

async function solve(lines: string[], b = false) {
	let sum = 0

	const grid = []

	for (const line of lines) {
		grid.push(line.split('').map((value) => ({ value, visited: false, nb: null })))
	}

	while (true) {
		const start = findNextUnvisited(grid)
		if (!start) {
			break
		}

		const queue = [start]

		const patch = new Set<string>()

		let debug = null

		while (queue.length > 0) {
			const [y, x] = queue.shift().split(',').map(Number)

			if (grid[y][x].visited) {
				continue
			}

			const type = grid[y][x].value
			debug = type

			grid[y][x].visited = true
			patch.add(`${y},${x}`)

			grid[y][x].nb = nb.filter(([dy, dx]) => grid[y + dy]?.[x + dx]?.value !== type).map(([dy, dx]) => `${dy},${dx}`)
			nb.forEach(([dy, dx]) => {
				const ny = y + dy
				const nx = x + dx
				if (isInBounds(grid, ny, nx) && !grid[ny][nx].visited && grid[ny][nx].value === type && !patch.has(`${ny},${nx}`)) {
					queue.push(`${ny},${nx}`)
					// console.log(grid[ny][nx])
				}
			})
			// console.log('queue.length', debug, queue.length)
		}
		// console.log('visited', grid.reduce((acc, curr, i) => acc + grid[i].reduce((a, c) => a + c.visited, 0), 0))

		if (!b) {
			let fence = 0
			let area = patch.size

			patch.forEach((coord) => {
				const [y, x] = coord.split(',').map(Number)
				fence += grid[y][x].nb.length
			})

			sum += area * fence
		} else {

			let fence = 0
			let area = patch.size

			const patchArr = Array.from(patch).map((coord) => coord.split(',').map(Number))

			// calculating patch boundaries and search for fences within takes time from 6s to 0.4s
			const patchBounds = {
				min: { x: Infinity, y: Infinity },
				max: { x: -Infinity, y: -Infinity },
			}
			patchArr.forEach(([y, x]) => {
				patchBounds.min.x = Math.min(patchBounds.min.x, x)
				patchBounds.min.y = Math.min(patchBounds.min.y, y)
				patchBounds.max.x = Math.max(patchBounds.max.x, x)
				patchBounds.max.y = Math.max(patchBounds.max.y, y)
			})

			let prevX = null
			let prevY = null
			for (let x = patchBounds.min.x - 1; x <= patchBounds.max.x + 1; x++) {
				for (let y = patchBounds.min.y - 1; y <= patchBounds.max.y + 1; y++) {
					const maskX = (patch.has(`${y},${x - 1}`) ? 1 : 0) * 10 + (patch.has(`${y},${x}`) ? 1 : 0) * 1
					if ((maskX === 10 || maskX === 1) && maskX !== prevX) {
						fence++
					}
					prevX = maskX
				}
			}
			for (let y = patchBounds.min.y - 1; y <= patchBounds.max.y + 1; y++) {
				for (let x = patchBounds.min.x - 1; x <= patchBounds.max.x + 1; x++) {
					const maskY = (patch.has(`${y - 1},${x}`) ? 1 : 0) * 10 + (patch.has(`${y},${x}`) ? 1 : 0) * 1
					if ((maskY === 10 || maskY === 1) && maskY !== prevY) {
						fence++
					}
					prevY = maskY
				}
			}
			sum += area * fence
		}
	}

	return sum
}

describe('2024/12', async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('smalltest 1', async () => {
			const answer = await solve(['AAAA', 'BBCD', 'BBCC', 'EEEC'])
			expect(answer).toBe(140)
		})

		test('smalltest 2', async () => {
			const answer = await solve(['OOOOO', 'OXOXO', 'OOOOO', 'OXOXO', 'OOOOO'])
			expect(answer).toBe(772)
		})

		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer).toBe(1930)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer).toBe(1473408)
		})
	})

	describe('PART 2', async () => {
		test('smalltest 1', async () => {
			const answer = await solve(['AA', 'AB'], true)
			expect(answer).toBe(6 * 3 + 1 * 4)
		})

		test('smalltest 2', async () => {
			const answer = await solve(['AAAA', 'BBCD', 'BBCC', 'EEEC'], true)
			expect(answer).toBe(80)
		})

		test('smalltest 3', async () => {
			const answer = await solve(['OOOOO', 'OXOXO', 'OOOOO', 'OXOXO', 'OOOOO'], true)
			expect(answer).toBe(436)
		})

		test('smalltest 4', async () => {
			const answer = await solve(['EEEEE', 'EXXXX', 'EEEEE', 'EXXXX', 'EEEEE'], true)
			expect(answer).toBe(236)
		})

		test('smalltest 5', async () => {
			const answer = await solve(['AAAAAA', 'AAABBA', 'AAABBA', 'ABBAAA', 'ABBAAA', 'AAAAAA'], true)
			expect(answer).toBe(368)
		})

		test('TEST', async () => {
			const answer = await solve(linesTest, true)
			expect(answer).toBe(1206)
		})

		test('PROD', async () => {
			const answer = await solve(linesProd, true)
			expect(answer).toBe(886364)
		})
	})
})
