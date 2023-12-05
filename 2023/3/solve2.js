const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let sum = 0

const numbers = []
const gears = []
let y = 0

rl
    .on('line', (line) => {
        const numbersInLine = Array.from(line.matchAll(/(\d+)/g))
        numbersInLine.forEach(n => {
            const x = n.index
            const len = n[0].length
            numbers.push({
                n: Number(n[0]),
                pos: Array.from(Array(len).keys()).map(i => {
                    return {x: x+i, y}
                })
            })
        })
        const symbolsInLine = Array.from(line.matchAll(/(\*)/g))
        symbolsInLine.forEach(s => {
            const x = s.index
            gears.push({x, y})
        })

        y++;
    })
    .on('close', () => {
        gears.forEach(g => {
            const neighbours = numbers.filter(n => {
                // check each digit of the number, whether it has a gear as neighbour
                const isNeighbour = n.pos.reduce((acc, curr) => {
                    return acc || (Math.abs(curr.x - g.x) < 2 && Math.abs(curr.y - g.y) < 2)
                }, false)
                return isNeighbour
            })
            if (neighbours.length === 2) {
                sum += neighbours[0].n * neighbours[1].n
            }
        })
        console.log('part 2', sum)
    })

