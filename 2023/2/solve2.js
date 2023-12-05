const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

const rgb = [12, 13, 14]

let sum = 0

rl
    .on('line', (line) => {
        const round = Number(line.match(/^Game (\d+):/)[1])
        console.log('round', round)
        const reveals = line.split(': ')[1].split(';')
        const max = reveals.reduce((acc, reveal) => {
            const r = Number(reveal.match(/(\d+) red/)?.[1]) || 0
            const g = Number(reveal.match(/(\d+) green/)?.[1]) || 0
            const b = Number(reveal.match(/(\d+) blue/)?.[1]) || 0
            return [Math.max(acc[0], r), Math.max(acc[1], g), Math.max(acc[2], b)]
        }, [0, 0, 0])
        const power = max.reduce((acc, curr) => (acc * curr), 1)
        sum += power
        // const possible = max.reduce((acc, curr, i) => {
        //     return acc && curr <= rgb[i]
        // }, true)
        // if (possible) sum += round
        // console.log(possible)
    })
    .on('close', () => {
        console.log('part 2', sum)
    })
