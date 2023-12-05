const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('test2.txt')
});

let sum = 0
let lines = []
let i = 0

rl
    .on('line', (line) => {
        const parts = line.split('|')
        const winningSide = parts[0].split(':')[1]
        const mineSide = parts[1]
        const winning = Array.from(winningSide.matchAll(/(\d+)/g))?.map(n => Number(n[0])) || null
        const mine = Array.from(mineSide.matchAll(/(\d+)/g))?.map(n => Number(n[0])) || null
        // console.log({winning, mine})
        lines[i] = lines[i] || 0
        const amount = mine.filter(m => winning.includes(m)).length
        const multiplier = lines[i] || 1
        for (let j = 0; j < amount; j++) {
            lines[i + j] = (lines[i + j + 1] || 0) + amount
        }
        i++;
    })
    .on('close', () => {
        console.log({lines})
        lines = lines.slice(0, i - 1)
        sum = lines.reduce((acc, curr) => (acc + curr), 0)
        console.log('part 2', sum)

    })

