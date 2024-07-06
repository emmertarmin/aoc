import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'

const day = '21'

async function solve(lines: string[]) {
  const monkeys = Object.create(null)

  for (const line of lines) {
    const {name, task} = line.match(/^(?<name>\w+): (?<task>.*)$/).groups
    if (/^\d+$/.test(task)) {
      monkeys[name] = {number: parseInt(task)}
    }

    if (/^(\w+) ([\+\-\*\/]) (\w+)$/.test(task)) {
      const {a, op, b} = task.match(/^(?<a>\w+) (?<op>[\+\-\*\/]) (?<b>\w+)$/).groups
      monkeys[name] = {a, op, b}
    }
  }

  function shout (name: string) {
    const monkey = monkeys[name]
    if (monkey.hasOwnProperty('number')) return monkey.number
    if (monkey.op) {
      const a = shout(monkey.a)
      const b = shout(monkey.b)
      return eval(`${a} ${monkey.op} ${b}`)
    }
  }

  return shout('root')
}

async function solve2(lines: string[]) {
  const monkeys = Object.create(null)

  for (const line of lines) {
    const {name, task} = line.match(/^(?<name>\w+): (?<task>.*)$/).groups
    if (/^\d+$/.test(task)) {
      monkeys[name] = {number: parseInt(task)}
    }

    if (/^(\w+) ([\+\-\*\/]) (\w+)$/.test(task)) {
      const {a, op, b} = task.match(/^(?<a>\w+) (?<op>[\+\-\*\/]) (?<b>\w+)$/).groups
      monkeys[name] = {a, op, b}
    }
  }

  monkeys['root'].op = '==='
  monkeys['humn'].number = 'x'

  function shout (name: string) {
    const monkey = monkeys[name]
    if (monkey.hasOwnProperty('number')) return monkey.number
    if (monkey.op) {
      const a = shout(monkey.a)
      const b = shout(monkey.b)
      return `(${a} ${monkey.op} ${b})`
    }
  }

  let eq = shout('root')
  eq = eq.replace(/^\((.*)\)$/, '$1')

  const r = /\(([\d\.]+) ([\+\-\*\/]) ([\d\.]+)\)/
  while (r.test(eq)) {
    eq = eq.replace(r, (_, a, op, b) => eval(`${a} ${op} ${b}`))
  }

  let sides = eq.split(' === ')
  let known = sides.find(side => !side.includes('x'))
  eq = sides.find(side => side.includes('x'))

  const rLeft = /^\(([\d\.]+) ([\+\-\*\/]) (.*)\)$/
  const rRight = /^\((.*) ([\+\-\*\/]) ([\d\.]+)\)$/

  while (eq !== 'x') {
    // await new Promise(r => setTimeout(r, 1000))
    if (rLeft.test(eq)) {
      /* format e.g. (2 + x) */
      let [_, a, op, b] = eq.match(rLeft)
      // console.log(`${eq} = ${known}`)
      if (op === '+') known = eval(`${known} - ${a}`)
      if (op === '*') known = eval(`${known} / ${a}`)
      if (op === '-') known = eval(`-1 * (${known} - ${a})`)
      if (op === '/') known = eval(`1 / (${known} / ${a})`)
      eq = b
    } else if (rRight.test(eq)) {
      /* format e.g. (x + 2) */
      let [_, a, op, b] = eq.match(rRight)
      // console.log(`${eq} = ${known}`)
      if (op === '+') known = eval(`${known} - ${b}`)
      if (op === '*') known = eval(`${known} / ${b}`)
      if (op === '-') known = eval(`${known} + ${b}`)
      if (op === '/') known = eval(`${known} * ${b}`)
      eq = a
    } else {
      break
    }
  }

  return known
}

describe(`day ${day}`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

  describe('part 1 test', async () => {
    test('answer', async () => {
      const answer = await solve(linesTest)
      expect(answer).toBe(152);
    })
	})
  describe('part 1 prod', async () => {
    test('answer', async () => {
      const answer = await solve(linesProd)
      expect(answer).toBe(49288254556480);
    })
  })

  describe('part 2 test', async () => {
    test('answer', async () => {
      const answer = await solve2(linesTest)
      expect(answer).toBe(301);
    })
  })

  describe('part 2 prod', async () => {
    test('answer', async () => {
      const answer = await solve2(linesProd)
      expect(answer).not.toBe(7010269744525.519);
      expect(answer).toBeGreaterThan(606685339927);
      expect(answer).toBe(3558714869436);
    })
  })

})
