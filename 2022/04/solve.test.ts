import { describe, expect, test } from 'bun:test'
import { readFileLineByLine } from '@/io'

const day = '04'

describe(`day ${day}`, async () => {
    describe('part 1', async () => {
        const path = `${import.meta.dir}/input.txt`;

        const lines: {[key: string]: number}[] = [];

        const onLineRead = (line: string) => {
            const parsed = line.trim().match(/(?<s1b>\d+)-(?<s1e>\d+),(?<s2b>\d+)-(?<s2e>\d+)/)?.groups;
            // convert object properties to numbers
            if (parsed) {
                const withNums = {}
                for (const key in parsed) {
                    withNums[key] = parseInt(parsed[key]);
                }
                lines.push(withNums);
            }
        }

        const onFinish = () => {
            // console.log(lines);
        }

        await readFileLineByLine(path, onLineRead, onFinish);

        let tally = 0

        for (const line of lines) {
            if (line.s1b <= line.s2b && line.s1e >= line.s2e) {
                tally += 1;
                continue
            }
            if (line.s2b <= line.s1b && line.s2e >= line.s1e) {
                tally += 1;
                continue
            }
        }

        test('answer', async () => {
            expect(tally).toBe(571);
        })
    })

    describe('part 2', async () => {
        const path = `${import.meta.dir}/input.txt`;

        const lines: {[key: string]: number}[] = [];

        const onLineRead = (line: string) => {
            const parsed = line.trim().match(/(?<s1b>\d+)-(?<s1e>\d+),(?<s2b>\d+)-(?<s2e>\d+)/)?.groups;
            // convert object properties to numbers
            if (parsed) {
                const withNums = {}
                for (const key in parsed) {
                    withNums[key] = parseInt(parsed[key]);
                }
                lines.push(withNums);
            }
        }

        const onFinish = () => {
            // console.log(lines);
        }

        await readFileLineByLine(path, onLineRead, onFinish);

        let tally = 0

        for (const line of lines) {
            if (line.s1b <= line.s2b && line.s1e >= line.s2b) {
                tally += 1;
                continue
            }
            if (line.s2b <= line.s1b && line.s2e >= line.s1b) {
                tally += 1;
                continue
            }
        }

        test('answer', async () => {
            expect(tally).toBe(917);
        })
    })
})
