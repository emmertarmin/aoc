import { describe, expect, test } from 'bun:test'
import { readFileLineByLine } from '@/io'

const day = '05'

describe(`day ${day}`, async () => {
    describe('part 1', async () => {
        const path = `${import.meta.dir}/input.txt`;

        const crates: any[] = []

        const moves: any[] = []

        const onLineRead = (line: string) => {
            if (/\[/.test(line)) {
                for (let i = 1; i < line.length; i+= 4) {
                    const c = (i-1)/4
                    while (crates.length <= c) crates.push('')
                    if (/[A-Z ]/.test(line[i])) crates[c] = line[i].replace(' ', '') + crates[c]
                }
            }
            if (/move \d+ from \d+ to \d+/.test(line)) {
                moves.push(line.match(/move (?<n>\d+) from (?<src>\d+) to (?<dst>\d+)/)?.groups)
            }
        }

        const onFinish = () => {
            // console.log(lines);
        }

        await readFileLineByLine(path, onLineRead, onFinish);

        function handleMove(n: number, src: number, dst: number) {
            for (const i of Array.from({length: n}, (_, i) => i)) {
                const crate = crates[src - 1]
                crates[src - 1] = crate.slice(0, crate.length - 1)
                crates[dst - 1] += crate[crate.length - 1]
            }
        }

        for (const move of moves) {
            handleMove(+move.n, +move.src, +move.dst)
            // await new Promise(resolve => setTimeout(resolve, 1000));
        }

        test('answer', async () => {
            expect(crates.reduce((acc, curr) => acc + curr[curr.length - 1], '')).toBe('GFTNRBZPF');
        })
    })

    describe('part 2', async () => {
        const path = `${import.meta.dir}/input.txt`;

        const crates: any[] = []

        const moves: any[] = []

        const onLineRead = (line: string) => {
            if (/\[/.test(line)) {
                for (let i = 1; i < line.length; i+= 4) {
                    const c = (i-1)/4
                    while (crates.length <= c) crates.push('')
                    if (/[A-Z ]/.test(line[i])) crates[c] = line[i].replace(' ', '') + crates[c]
                }
            }
            if (/move \d+ from \d+ to \d+/.test(line)) {
                moves.push(line.match(/move (?<n>\d+) from (?<src>\d+) to (?<dst>\d+)/)?.groups)
            }
        }

        const onFinish = () => {
            // console.log(lines);
        }

        await readFileLineByLine(path, onLineRead, onFinish);

        function handleMove(n: number, src: number, dst: number) {
                const crate = crates[src - 1]
                const toMove = crate.slice(crate.length - n)
                crates[src - 1] = crate.slice(0, crate.length - n)
                crates[dst - 1] += toMove
        }

        for (const move of moves) {
            handleMove(+move.n, +move.src, +move.dst)
            // await new Promise(resolve => setTimeout(resolve, 300));
            // console.log(['\n', ...crates.map((c, i) => i + ' ' + c)].join('\n'));
        }

        test('answer', async () => {
            expect(crates.reduce((acc, curr) => acc + curr[curr.length - 1], '')).toBe('VRQWPDSGP');
        })
    })
})
