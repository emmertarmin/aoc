import { describe, expect, test } from 'bun:test'
import { getLines, readFileLineByLine } from '@/io'

const day = '08'

describe(`day ${day}`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`)

	const trees = lines.map(line => line.split('').map(char => ({h: parseInt(char), visible: false})))

	function print() {
		for (const tree of trees) {
			// console.log(tree.map(t => t.h + `${t.visible ? '✅' : '❌'}`).join('  '))
			console.log(tree.map(t => `${t.visible ? '✅' : '❌'}`).join(''))
		}
		console.log('')
	}

	// print()

	function isTreeVisible(x: number, y: number) {
		const tree = trees[y][x]
		if (tree.visible) {
			return true
		}

		// visible from the left
		if (trees[y].slice(0, x).every(t => t.h < tree.h)) {
			return true
		}
		// visible from the right
		if (trees[y].slice(x + 1).every(t => t.h < tree.h)) {
			return true
		}
		// visible from the top
		if (trees.slice(0, y).every(row => row[x].h < tree.h)) {
			return true
		}
		// visible from the bottom
		if (trees.slice(y + 1).every(row => row[x].h < tree.h)) {
			return true
		}

		return false
	}

	trees.forEach((row, y) => {
		row.forEach((tree, x) => {
			tree.visible = isTreeVisible(x, y)
		})
	})

	// print()

	const visibleTrees = trees.flat().filter(tree => tree.visible).length

	test('answer 1', async () => {
		expect(visibleTrees).toBe(1711);
	})

	function getScenicScore(x: number, y: number) {
		const tree = trees[y][x]

		const scenes = [0, 0, 0, 0]

		if (x === 0 || x === trees[0].length - 1 || y === 0 || y === trees.length - 1) {
			return 0
		}

		// trees visible to the left
		for (const test of trees[y].slice(0, x).reverse()) {
			if (test.h < tree.h) { scenes[0]++ } else { scenes[0]++; break }
		}
		// trees visible to the right
		for (const test of trees[y].slice(x + 1)) {
			if (test.h < tree.h) { scenes[1]++ } else { scenes[1]++; break }
		}
		// trees visible to the top
		for (const test of trees.slice(0, y).map(row => row[x]).reverse()) {
			if (test.h < tree.h) { scenes[2]++ } else { scenes[2]++; break }
		}
		// trees visible to the bottom
		for (const test of trees.slice(y + 1).map(row => row[x])) {
			if (test.h < tree.h) { scenes[3]++ } else { scenes[3]++; break }
		}
		return scenes.reduce((acc, curr) => acc * Math.max(curr, 1), 1)
	}

	let max = 0;

	trees.forEach((row, y) => {
		row.forEach((tree, x) => {
			const score = getScenicScore(x, y)
			trees[y][x].scenicScore = score
			if (score > max) max = score
		})
	})

	// console.log(max)

	test('answer 2', async () => {
		expect(max).toBe(301392);
	})
})
