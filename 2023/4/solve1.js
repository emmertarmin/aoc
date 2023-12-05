const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let sum = 0

rl
    .on('line', (line) => {
        const parts = line.split('|')
        const winningSide = parts[0].split(':')[1]
        const mineSide = parts[1]
        const winning = Array.from(winningSide.matchAll(/(\d+)/g))?.map(n => Number(n[0])) || null
        const mine = Array.from(mineSide.matchAll(/(\d+)/g))?.map(n => Number(n[0])) || null
        // console.log({winning, mine})
        let points = 0
        mine.filter(n => winning.includes(n)).forEach(i => {
            points = points === 0 ? 1 : points * 2
        })
        sum += points
    })
    .on('close', () => {
        console.log('part 1', sum)
    })

