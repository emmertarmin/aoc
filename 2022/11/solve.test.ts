import { describe, expect, test } from 'bun:test'
import { getLines, readFileLineByLine } from '@/io'

const day = '11'

describe(`day ${day}`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

	async function solve(worryDivisor: number, rounds: number) {
		// this.op = (n: number) => Math.floor(eval(this.opStr.replace('old', String(n))) / 3)
		// this.test = (n: number) => n % testDivisor === 0
		let curr = -1

		const monkeys: {
			items: number[],
			opStr: string,
			testDivisor: number,
			ifTrue: number,
			ifFalse: number,
			name: string,
			inspections: number
		}[] = []

		for (const line of lines) {
			if (/^Monkey (?<num>\d+):$/.test(line)) {
				curr = parseInt(/^Monkey (?<num>\d+):$/.exec(line).groups.num)
				// console.log(`Monkey ${curr}`)
				monkeys[curr] = {
					items: [],
					opStr: '',
					testDivisor: 0,
					ifTrue: 0,
					ifFalse: 0,
					name: `Monkey-${curr}`,
					inspections: 0
				}
				continue
			}

			if (/^Starting items: (?<items>[\d, ]*)$/.test(line)) {
				const items = /^Starting items: (?<items>[\d, ]*)$/.exec(line).groups.items.split(',').map(i => parseInt(i))
				// console.log(`Items: ${items.join(', ')}`)
				monkeys[curr].items = items
				continue
			}

			if (/^Operation: (?<op>.*)$/.test(line)) {
				const op = /^Operation: new = (?<op>.*)$/.exec(line).groups.op
				// console.log(`Operation: ${op}`)
				monkeys[curr].opStr = op
				continue
			}

			if (/^Test: divisible by (?<num>\d+)$/.test(line)) {
				const num = parseInt(/^Test: divisible by (?<num>\d+)$/.exec(line).groups.num)
				// console.log(`Test: divisible by ${num}?`)
				monkeys[curr].testDivisor = num
				continue
			}

			if (/^If true: (?<num>.*)$/.test(line)) {
				const num = /^If true: throw to monkey (?<num>.*)$/.exec(line).groups.num
				// console.log(`If true: ${num}`)
				monkeys[curr].ifTrue = parseInt(num)
				continue
			}

			if (/^If false: (?<num>.*)$/.test(line)) {
				const num = /^If false: throw to monkey (?<num>.*)$/.exec(line).groups.num
				// console.log(`If false: ${num}`)
				monkeys[curr].ifFalse = parseInt(num)
				continue
			}
		}

		// console.log(monkeys)

		const common = monkeys.reduce((acc, curr) => curr.testDivisor * acc, 1 )

		for (const round of Array(rounds).keys()) {
			for (const monkey of monkeys) {
				while (monkey.items.length > 0) {
					const item = monkey.items.shift()
					const result = Math.floor(eval(monkey.opStr.replaceAll('old', String(item))) / worryDivisor) % common
					monkey.inspections++
					if (result % monkey.testDivisor === 0) {
						monkeys[monkey.ifTrue].items.push(result)
						// console.log(monkey.name, item, result, monkey.testDivisor, `throw to ${monkey.ifTrue}`)
					} else {
						monkeys[monkey.ifFalse].items.push(result)
						// console.log(monkey.name, item, result, monkey.testDivisor, `throw to ${monkey.ifFalse}`)
					}
				}
			}
		}

		// console.log(monkeys)

		// console.log(monkeys.map(m => m.inspections))

		const inspections = monkeys.map(m => m.inspections).sort((a, b) => b - a)

		// console.log(inspections)

		return inspections[0] * inspections[1]
	}

	test('answer 1', async () => {
		expect(await solve(3, 20)).toBe(76728);
	})

	test('answer 2', async () => {
		expect(await solve(1, 10000)).toBe(21553910156);
	})


})
