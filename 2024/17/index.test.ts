// @ts-ignore: bun-test-ignore-file
import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

function run(registers: Map<string, number>, program: number[]) {
	let output = []

	const combo = (operand: number): number => ([
		() => 0,
		() => 1,
		() => 2,
		() => 3,
		() => registers.get('A'),
		() => registers.get('B'),
		() => registers.get('C'),
		() => { throw new Error('Invalid operand') }
	][operand])()

	function adv(operand: number) {
		const result = Math.trunc(registers.get('A') / (2 ** combo(operand)))
		registers.set('A', result)
		return result
	}

	function bxl(operand: number) {
		const result = registers.get('B') ^ operand
		registers.set('B', result)
		return result
	}

	function bst(operand: number) {
		const result = combo(operand) & 7
		registers.set('B', result)
		return result
	}

	function jnz(operand: number) {
		if (registers.get('A') !== 0) {
			return operand
		}
		return null
	}

	function bxc(operand: number) {
		const result = registers.get('B') ^ registers.get('C')
		registers.set('B', result)
		return result
	}

	function out(operand: number) {
		const result = combo(operand) & 7
		output.push(result)
		return result
	}

	function bdv(operand: number) {
		const result = Math.trunc(registers.get('A') / (2 ** combo(operand)))
		registers.set('B', result)
		return result
	}

	function cdv(operand: number) {
		const result = Math.trunc(registers.get('A') / (2 ** combo(operand)))
		registers.set('C', result)
		return result
	}

	for (let i = 0; i < program.length;) {
		if (output.length > 16) {
			throw new Error('Too many outputs')
		}
		const instruction = program[i]
		const operand = program[i + 1]

		switch (instruction) {
			case 0: // division
				adv(operand)
				break
			case 1: // bitwise XOR
				bxl(operand)
				break
			case 2: // combo operand modulo 8
				bst(operand)
				break
			case 3: // jump if not zero
				if (typeof jnz(operand) === 'number') {
					i = jnz(operand) - 2
				}
				break
			case 4: // bitwise XOR of register B and register C
				bxc(operand)
				break
			case 5: // calculates the value of its combo operand modulo 8, then outputs that value
				out(operand)
				break
			case 6: // works exactly like the adv instruction except that the result is stored in the B register
				bdv(operand)
				break
			case 7: // works exactly like the adv instruction except that the result is stored in the C register
				cdv(operand)
				break
			default:
				throw new Error('Invalid opcode')
		}

		i += 2
	}

	// console.log({registers, output})

	return {
		r: registers,
		o: output
	}

}

async function solve(lines: string[]) {
	const reRegister = /^Register (?<name>\w+): (?<value>\d+)$/
	const reProgram = /^Program: (?<list>[\d,]+)$/

	const registers = new Map<string, number>()
	const program = []

	for (const line of lines) {
		if (reRegister.test(line)) {
			const { name, value } = line.match(reRegister).groups
			registers.set(name, parseInt(value))
		}
		if (reProgram.test(line)) {
			const { list } = line.match(reProgram).groups
			list.split(',').map(n => parseInt(n)).forEach(n => program.push(n))
		}
	}

	// console.log({registers, program})

	const { r, o } = run(registers, program)

	return {
		registers: r,
		output: o.join(',')
	}
}

async function solveB(lines: string[]) {
	const reRegister = /^Register (?<name>\w+): (?<value>\d+)$/
	const reProgram = /^Program: (?<list>[\d,]+)$/

	const registers = new Map<string, number>()
	const program = []

	for (const line of lines) {
		if (reRegister.test(line)) {
			const { name, value } = line.match(reRegister).groups
			registers.set(name, parseInt(value))
		}
		if (reProgram.test(line)) {
			const { list } = line.match(reProgram).groups
			list.split(',').map(n => parseInt(n)).forEach(n => program.push(n))
		}
	}

	// console.log({registers, program})

	function test(a) {
		registers.set('A', a)
		const { r, o } = run(registers, program)
		return o
	}

	// console.log(test(1 * Math.pow(8, 1) + 2 * Math.pow(8, 2) + 3 * Math.pow(8, 3)))

	/**
	 * If you run program(n) where n is register A and get output a,b,c,...,
	 * then program(8 * n) will be the first time the output will be _,a,b,c,...,
	 * which gives a good starting point to find the next n for
	 * the rest of your target pattern.
	 */

	// for (let i = 0; i < 16; i++) {
	// 	console.log(test(8*8*8*8 + i).join(','), i)
	// }

	let guard = 0
	let digits = 2
	let a = 1
	while (true) {
		if (guard > 10_000_000) { // I'm paranoid
			throw new Error('Guard')
		}
		guard++

		const curr = test(a)
		if (curr.length > program.length) {
			throw new Error('Too big output length')
		}
		// console.log(curr.toReversed().join(','), a, guard)
		// console.log(program.toReversed().join(','))
		// console.log('________')

		if (program.join(',') === curr.join(',')) {
			break
		}

		if (program.join(',').endsWith(curr.join(','))) {
			a = a * 8
			digits++
			guard = 0
			continue
		}
		a++
	}

	return a
}

describe('2024/17', async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

	describe('PART 1', async () => {
		test('smalltest 1', async () => {
			const answer = await solve([
				'Register C: 9',
				'Program: 2,6'
			])
			expect(answer.registers.get('B')).toBe(1)
		})

		test('smalltest 2', async () => {
			const answer = await solve([
				'Register A: 10',
				'Program: 5,0,5,1,5,4'
			])
			expect(answer.output).toBe('0,1,2')
		})

		test('smalltest 3', async () => {
			const answer = await solve([
				'Register A: 2024',
				'Program: 0,1,5,4,3,0'
			])
			expect(answer.output).toBe('4,2,5,6,7,7,7,7,3,1,0')
			expect(answer.registers.get('A')).toBe(0)
		})

		test('smalltest 4', async () => {
			const answer = await solve([
				'Register B: 29',
				'Program: 1,7'
			])
			expect(answer.registers.get('B')).toBe(26)
		})

		test('smalltest 5', async () => {
			const answer = await solve([
				'Register B: 2024',
				'Register C: 43690',
				'Program: 4,0'
			])
			expect(answer.registers.get('B')).toBe(44354)
		})

		test('TEST', async () => {
			const answer = await solve(linesTest)
			expect(answer.output).toBe('4,6,3,5,6,3,5,2,1,0')
		})

		test('PROD', async () => {
			const answer = await solve(linesProd)
			expect(answer.output).toBe('4,3,2,6,4,5,3,2,4')
		})
	})

	describe('PART 2', async () => {
		test('TEST', async () => {
			const answer = await solveB([
				'Register A: 2024',
				'Register B: 0',
				'Register C: 0',
				'Program: 0,3,5,4,3,0'
			])
			expect(answer).toBe(117440)
		}, 1000 * 60 * 10)

		test('PROD', async () => {
			const answer = await solveB(linesProd)
			expect(answer).toBe(164540892147389)
		}, 1000 * 60 * 10)
	})
})
