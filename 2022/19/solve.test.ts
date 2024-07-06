import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

const day = '19'

async function solve(lines: string[], partB: boolean = false) {
	/* resources: ore, clay, obsidian, geode
	 * 0: ore robot
	 * 1: clay robot
	 * 2: obsidian robot
	 * 3: geode robot
	 * 4: ore
	 * 5: clay
	 * 6: obsidian
	 * 7: geode
	 */
	const blueprints = []
	for (const line of lines.slice(0, partB ? 3 : Infinity)) {
		const props = line.match(/Blueprint (?<num>\d+): Each ore robot costs (?<oreRobotCostOre>\d+ ore). Each clay robot costs (?<clayRobotCostOre>\d+ ore). Each obsidian robot costs (?<obsRobotCostOre>\d+ ore) and (?<obsRobotCostClay>\d+ clay). Each geode robot costs (?<geoRobotCostOre>\d+ ore) and (?<geoRobotCostObs>\d+ obsidian.)/).groups
		blueprints.push([
			[parseInt(props.oreRobotCostOre), 0, 0],
			[parseInt(props.clayRobotCostOre), 0, 0],
			[parseInt(props.obsRobotCostOre), parseInt(props.obsRobotCostClay), 0],
			[parseInt(props.geoRobotCostOre), 0, parseInt(props.geoRobotCostObs)]
		])
	}

	// console.log(blueprints)

	let sum = 0
	let mult = 1
	let bpNum = 1

	for (const bp of blueprints) {
		const maxCost = [0,1,2,3]
			.map(i => [bp[i][0], bp[i][1], bp[i][2]])
			.reduce((acc, curr) => ([Math.max(acc[0], curr[0]), Math.max(acc[1], curr[1]), Math.max(acc[2], curr[2])]), [0,0,0])

		function canAfford(res: number[], robot: number) {
			return res[4] >= bp[robot][0] && res[5] >= bp[robot][1] && res[6] >= bp[robot][2]
		}
		function act (res: number[], mask: boolean[], t: number) {
			if (t >= (partB ? 32 : 24)) return res[7]
			const opts = []
			if (mask[0] && canAfford(res, 0) && res[0] < maxCost[0]) { // purchase ore robot
				opts.push({r: [res[0]+1, res[1], res[2], res[3], res[4]-bp[0][0]+res[0], res[5]-bp[0][1]+res[1], res[6]-bp[0][2]+res[2], res[7]+res[3]], m: [true, true, true, true]})
			}
			if (mask[1] && canAfford(res, 1) && res[1] < maxCost[1]) { // purchase clay robot
				opts.push({r: [res[0], res[1]+1, res[2], res[3], res[4]-bp[1][0]+res[0], res[5]-bp[1][1]+res[1], res[6]-bp[1][2]+res[2], res[7]+res[3]], m: [true, true, true, true]})
			}
			if (mask[2] && canAfford(res, 2) && res[2] < maxCost[2]) { // purchase obsidian robot
				opts.push({r: [res[0], res[1], res[2]+1, res[3], res[4]-bp[2][0]+res[0], res[5]-bp[2][1]+res[1], res[6]-bp[2][2]+res[2], res[7]+res[3]], m: [true, true, true, true]})
			}
			if (canAfford(res, 3)) { // purchase geode robot
				opts.push({r: [res[0], res[1], res[2], res[3]+1, res[4]-bp[3][0]+res[0], res[5]-bp[3][1]+res[1], res[6]-bp[3][2]+res[2], res[7]+res[3]], m: [true, true, true, true]})
			} else {
				opts.push({r: [res[0], res[1], res[2], res[3], res[4]+res[0], res[5]+res[1], res[6]+res[2], res[7]+res[3]], m: [0, 1, 2, 3].map(i => !canAfford(res, i))})
			}
			return Math.max(...opts.map(o => act(o.r, o.m, t+1)))
		}

		const geodes = act([1, 0, 0, 0, 0, 0, 0, 0], [true, true, true, true], 0)
		console.log(bpNum, geodes, ((bpNum / blueprints.length)*100).toFixed(1) + '%')

		if (partB) {
			mult *= geodes
		} else {
			sum += bpNum * geodes
		}

		bpNum++
	}

	return partB ? mult : sum
}

describe(`day ${day} test`, async () => {
	const lines = await getLines(`${import.meta.dir}/test1.txt`) as string[]

	test.only('answer 1', async () => {
		expect(await solve(lines)).toBe(33);
	})

	test.only('answer 2', async () => {
		expect(await solve(lines, true)).toBe(56*62);
	})
})

describe(`day ${day} prod`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	test('answer 1', async () => {
		const answer = await solve(lines)
		expect(answer).toBe(1009);
	})

	test('answer 2', async () => {
		expect(await solve(lines, 3, 32)).toBe(0);
	})
})
