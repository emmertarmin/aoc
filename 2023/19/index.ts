import { describe, expect, test } from 'bun:test'
import { getLines } from '../../2024/io'

function checkOrder(pageList: number[], rules: { a: number, b: number }[]) {
    for (const rule of rules) {
        const posA = pageList.indexOf(rule.a)
        const posB = pageList.indexOf(rule.b)
        if (posA >= 0 && posB >= 0 && posA > posB) {
            return false
        }
    }
    return true
}

async function solve(lines: string[]) {
    let sum = 0

    let rules = {}
    let parts: { x: number, m: number, a: number, s: number }[] = []

    const REPart = /\{x=(?<x>\d+),m=(?<m>\d+),a=(?<a>\d+),s=(?<s>\d+)\}/
    const RERule = /(?<name>\w+)\{(?<rulesList>([xmas][<>]\d+:\w+,)+)(?<terminate>\w+)\}/

    for (const line of lines) {
        if (line.match(REPart)) {
            const { x, m, a, s } = line.match(REPart)?.groups as any
            parts.push({ x: parseInt(x), m: parseInt(m), a: parseInt(a), s: parseInt(s) })
        }
        if (line.match(RERule)) {
            let { name, rulesList, terminate } = line.match(RERule)?.groups as any
            rulesList = rulesList.split(',')
                .filter(Boolean)
                .map((rule: string) => {
                    const { param, op, cond, goto } = rule.match(/(?<param>[xmas])(?<op>[<>])(?<cond>\d+):(?<goto>\w+)/)?.groups as any
                    return {
                        check: (part: { x: number, m: number, a: number, s: number }) => {
                            return eval(`${part[param]} ${op} ${cond}`)
                        },
                        goto
                    }
                })
            rules[name] = [
                ...rulesList,
                {
                    check: () => true,
                    goto: terminate
                }
            ]
        }
    }

    // console.dir({ rules }, { depth: null })

    function rec(part: { x: number, m: number, a: number, s: number }, ruleName: string = 'in') {
        // stop condition
        if (ruleName === 'A') return true
        if (ruleName === 'R') return false

        // apply current part to designated rule
        for (const rule of rules[ruleName]) {
            if (rule.check(part)) {
                return rec(part, rule.goto)
            }
        }
    }

    for (const part of parts) {
        const accepted = rec(part)

        // console.log(`part: ${JSON.stringify(part)}`, accepted)

        if (accepted) {
            sum += part.x + part.m + part.a + part.s
        }
    }

    return sum
}

async function solveB(lines: string[]) {
    let sum = 0

    let rules = {}

    const RERule = /(?<name>\w+)\{(?<rulesList>([xmas][<>]\d+:\w+,)+)(?<terminate>\w+)\}/

    for (const line of lines) {
        if (line.match(RERule)) {
            let { name, rulesList, terminate } = line.match(RERule)?.groups as any
            rulesList = rulesList.split(',').filter(Boolean)
            rules[name] = [
                ...rulesList,
                terminate
            ]
        }
    }

    type Part = {
        x: number[],
        m: number[],
        a: number[],
        s: number[]
    }

    const fullPart: Part = {
        x: Array.from({ length: 4000 }, (_, i) => i + 1),
        m: Array.from({ length: 4000 }, (_, i) => i + 1),
        a: Array.from({ length: 4000 }, (_, i) => i + 1),
        s: Array.from({ length: 4000 }, (_, i) => i + 1)
    }

    function bisect(part: Part, rule: string): [Part, Part] {
        const { param, op, cond, goto } = rule.match(/(?<param>[xmas])(?<op>[<>])(?<cond>\d+):(?<goto>\w+)/)?.groups as any
        const left = {
            x: param === 'x' ? part.x.filter(x => eval(`${x} ${op} ${cond}`)) : part.x,
            m: param === 'm' ? part.m.filter(x => eval(`${x} ${op} ${cond}`)) : part.m,
            a: param === 'a' ? part.a.filter(x => eval(`${x} ${op} ${cond}`)) : part.a,
            s: param === 's' ? part.s.filter(x => eval(`${x} ${op} ${cond}`)) : part.s
        }
        const right = {
            x: param === 'x' ? part.x.filter(x => !eval(`${x} ${op} ${cond}`)) : part.x,
            m: param === 'm' ? part.m.filter(x => !eval(`${x} ${op} ${cond}`)) : part.m,
            a: param === 'a' ? part.a.filter(x => !eval(`${x} ${op} ${cond}`)) : part.a,
            s: param === 's' ? part.s.filter(x => !eval(`${x} ${op} ${cond}`)) : part.s
        }
        return [left, right]
    }

    function rec(part, rule = 'in') {
        // exit condition
        if (rule === 'A') return part.x.length * part.m.length * part.a.length * part.s.length
        if (rule === 'R') return 0

        // if e follow down this path, there will be a series of new rules, each branching into two
        // we need to follow both paths and sum the results

        const ruleList = rules[rule]
        let partialSum = 0
        for (const curr of ruleList) {
            if (!curr.includes(':')) {
                partialSum += rec(part, curr)
                continue
            }
            const goto = curr.split(':')[1]
            const [left, right] = bisect(part, curr)
            partialSum += rec(left, goto)
            part = right
        }
        return partialSum
    }

    return rec(fullPart)
}

describe(`TEST`, async () => {
    const lines = await getLines(`${import.meta.dir}/test.txt`) as string[]

    test('answer 1', async () => {
        const answer = await solve(lines)
        expect(answer).toBe(19114);
    })

    test('answer 2', async () => {
        const answer = await solveB(lines)
        expect(answer).toBe(167409079868000);
    })
})

describe(`PROD`, async () => {
    const lines = await getLines(`${import.meta.dir}/input.txt`) as string[]

    test('answer 1', async () => {
        const answer = await solve(lines)
        expect(answer).toBe(333263);
    })

    test('answer 2', async () => {
        const answer = await solveB(lines)
        expect(answer).toBe(130745440937650);
    })
})
