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

	const answer = []
	let bpNum = 1

  const time = (partB ? 32 : 24)

	for (const bp of blueprints) {
		const maxCost = [0,1,2,3]
			.map(i => [bp[i][0], bp[i][1], bp[i][2]])
			.reduce((acc, curr) => ([Math.max(acc[0], curr[0]), Math.max(acc[1], curr[1]), Math.max(acc[2], curr[2])]), [0,0,0])

		function canAfford(res: number[]) {
			return [0, 1, 2, 3].map(robot => res[4] >= bp[robot][0] && res[5] >= bp[robot][1] && res[6] >= bp[robot][2])
		}
		function act (res: number[], mask: boolean[], t: number) {
			if (t >= time) return res[7]
      const afford = canAfford(res)
			let opts = []
      if (t === time - 1) return res[7] + res[3]
      // if (Math.max(...res.slice(4, 6)) > 35) return 0
			if (afford[3]) { // purchase geode robot
				opts.push({r: [res[0], res[1], res[2], res[3]+1, res[4]-bp[3][0]+res[0], res[5]-bp[3][1]+res[1], res[6]-bp[3][2]+res[2], res[7]+res[3]], m: [true, true, true, true]})
			} else {
        if (mask[0] && afford[0] && res[0] < maxCost[0]) { // purchase ore robot
          opts.push({r: [res[0]+1, res[1], res[2], res[3], res[4]-bp[0][0]+res[0], res[5]-bp[0][1]+res[1], res[6]-bp[0][2]+res[2], res[7]+res[3]], m: [true, true, true, true]})
        }
        if (mask[1] && afford[1] && res[1] < maxCost[1]) { // purchase clay robot
          opts.push({r: [res[0], res[1]+1, res[2], res[3], res[4]-bp[1][0]+res[0], res[5]-bp[1][1]+res[1], res[6]-bp[1][2]+res[2], res[7]+res[3]], m: [true, true, true, true]})
        }
        if (mask[2] && afford[2] && res[2] < maxCost[2]) { // purchase obsidian robot
          opts.push({r: [res[0], res[1], res[2]+1, res[3], res[4]-bp[2][0]+res[0], res[5]-bp[2][1]+res[1], res[6]-bp[2][2]+res[2], res[7]+res[3]], m: [true, true, true, true]})
        }
				opts.push({r: [res[0], res[1], res[2], res[3], res[4]+res[0], res[5]+res[1], res[6]+res[2], res[7]+res[3]], m: afford.map(i => !i)})
			}
			return Math.max(...opts.map(o => act(o.r, o.m, t+1)))
		}

		const geodes = act([1, 0, 0, 0, 0, 0, 0, 0], [true, true, true, true], 0)
		// console.log(bpNum, geodes, ((bpNum / blueprints.length)*100).toFixed(1) + '%')

    answer.push(geodes)

		bpNum++
	}

  console.log(answer)

	return partB ? answer.reduce((acc, curr) => acc * curr, 1) : answer.reduce((acc, curr, i) => acc + curr * (i + 1), 0)
}

describe(`day ${day}`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	test('answer 1 test', async () => {
		expect(await solve(linesTest)).toBe(33);
	})

	test('answer 1 prod', async () => {
		const answer = await solve(linesProd)
		expect(answer).toBe(1009);
	})

	test('answer 2 test', async () => {
		const answer = await solve(linesTest, true)
		expect(answer).toBe(56*62);
	})

	test('answer 2 prod', async () => {
		const answer = await solve(linesProd, true)
		expect(answer).toBe(18816);
	})
})
