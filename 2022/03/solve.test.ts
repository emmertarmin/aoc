import { describe, expect, test } from 'bun:test'
import { readFileLineByLine } from '@/io'

const day = '03'

describe(`day ${day}`, async () => {
    describe('part 1', async () => {
        const path = `${import.meta.dir}/input.txt`;

        const lines: string[] = [];

        const onLineRead = (line: string) => {
            const parsed = line.trim()
            if (parsed) {
                lines.push(parsed);
            }
        }

        const onFinish = () => {
            // console.log(lines);
        }

        await readFileLineByLine(path, onLineRead, onFinish);

        let tally = 0

        for (const line of lines) {
            const len = line.length
            const left = line.slice(0, len / 2)
            const right = line.slice(len / 2)
            const match = left.split('').find(c => right.includes(c)) || ''
            // get ascii value of the character
            const ascii = /[a-z]/.test(match) ? match.charCodeAt(0) - 96 : match.charCodeAt(0) - 38
            // console.log(match, ascii)
            tally += ascii
        }

        test('answer', async () => {
            expect(tally).toBe(8185);
        })
    })

    describe('part 2', async () => {
        const path = `${import.meta.dir}/input.txt`;

        const lines: string[] = [];

        const onLineRead = (line: string) => {
            const parsed = line.trim()
            if (parsed) {
                lines.push(parsed);
            }
        }

        const onFinish = () => {
            // console.log(lines);
        }

        await readFileLineByLine(path, onLineRead, onFinish);

        let tally = 0

        let group: any[] = []

        lines.forEach((line, i) => {
            if (i%3 === 0 || i%3 === 1) { group.push(line); return }

            const badge = line.split('').find(c => group[0].includes(c) && group[1].includes(c)) || ''

            const ascii = /[a-z]/.test(badge) ? badge.charCodeAt(0) - 96 : badge.charCodeAt(0) - 38

            tally += ascii

            group = []
        })

        test('answer', async () => {
            expect(tally).toBe(2817);
        })
    })
})
