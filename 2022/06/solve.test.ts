import { describe, expect, test } from 'bun:test'
import { readFileLineByLine } from '@/io'

const day = '06'

describe(`day ${day}`, async () => {
    const path = `${import.meta.dir}/input.txt`;

    const lines: any[] = []

    const onLineRead = (line: string) => {
        line = line.trim();
        if (line.length > 0) lines.push(line);
    }

    const onFinish = () => {
        // console.log(lines);
    }

    await readFileLineByLine(path, onLineRead, onFinish);

    function solve (nDiff: number) {
        let buffer = ''

        const markers: number[] = lines.map(line => {
            for (let i = nDiff; i < line.length; i++) {
                buffer = line.slice(i - nDiff, i)
                const set = new Set(buffer.split(''))
                if (set.size === nDiff) {
                    return i
                }
            }
        })

        console.log(markers)

        return markers
    }

    test('answer 1', async () => {
        expect(solve(4).reduce((acc, curr) => acc + curr, 0)).toBe(1544);
    })

    test('answer 2', async () => {
        expect(solve(14).reduce((acc, curr) => acc + curr, 0)).toBe(2145);
    })
})
