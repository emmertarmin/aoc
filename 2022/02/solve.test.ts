import { describe, expect, test } from 'bun:test'
import { readFileLineByLine } from '@/io'

const day = '02'

describe(`day ${day}`, async () => {
    describe('part 1', async () => {
        const path = `${import.meta.dir}/input.txt`;

        const lines: {i: 'A'|'B'|'C', o: 'X'|'Y'|'Z'}[] = [];

        const onLineRead = (line: string) => {
            const r = /(?<i>[A-Z]) (?<o>[XYZ])/;
            const parsed = line.trim().match(r)?.groups
            if (parsed) {
                lines.push(parsed as {i: 'A'|'B'|'C', o: 'X'|'Y'|'Z'});
            }
        }

        const onFinish = () => {
            // console.log(lines);
        }

        await readFileLineByLine(path, onLineRead, onFinish);

        const Points = new Map<string, number>([
            ['AZ', 0 + 3], // rock - scissors
            ['BX', 0 + 1], // paper - rock
            ['CY', 0 + 2], // scissors - paper
            ['AX', 3 + 1], // rock - rock
            ['BY', 3 + 2], // paper - paper
            ['CZ', 3 + 3], // scissors - scissors
            ['AY', 6 + 2], // rock - paper
            ['BZ', 6 + 3], // paper - scissors
            ['CX', 6 + 1], // scissors - rock
        ]);

        let tally = 0;

        for (const line of lines) {
            const {i, o} = line;
            const result = Points.get(i + o);
            // console.log(line, iPoints.get(o), oPoints.get(i + o), result);
            tally += result;
        }

        test('answer', async () => {
            expect(tally).toBe(11475);
        })
    })

    describe('part 2', async () => {
        const path = `${import.meta.dir}/input.txt`;

        const lines: {i: 'A'|'B'|'C', o: 'X'|'Y'|'Z'}[] = [];

        const onLineRead = (line: string) => {
            const r = /(?<i>[A-Z]) (?<o>[X|Y|Z])/;
            const parsed = line.trim().match(r)?.groups
            if (parsed) {
                lines.push(parsed as {i: 'A'|'B'|'C', o: 'X'|'Y'|'Z'});
            }
        }

        const onFinish = () => {
            // console.log(lines);
        }

        await readFileLineByLine(path, onLineRead, onFinish);

        const oPoints = new Map<string, number>([
            ['AX', 3 + 0], // rock + lose = scissors
            ['BX', 1 + 0], // paper + lose = rock
            ['CX', 2 + 0], // scissors + lose = paper
            ['AY', 1 + 3], // rock + draw = rock
            ['BY', 2 + 3], // paper + draw = paper
            ['CY', 3 + 3], // scissors + draw = scissors
            ['AZ', 2 + 6], // rock + win = paper
            ['BZ', 3 + 6], // paper + win = scissors
            ['CZ', 1 + 6], // scissors + win = rock
        ]);

        let tally = 0;

        for (const line of lines) {
            const {i, o} = line;
            const result = oPoints.get(i + o) || 0;
            // console.log(line, oPoints.get(i + o), result);
            tally += result;
        }

        test('answer', async () => {
            expect(tally).toBe(16862);
        })
    })
})
