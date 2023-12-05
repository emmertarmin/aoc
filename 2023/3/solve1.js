const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let sum = 0

const numbers = []
const parts =  []
const symbols = []
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
        const symbolsInLine = Array.from(line.matchAll(/([^\d\.])/g))
        symbolsInLine.forEach(s => {
            const x = s.index
            symbols.push({x, y})
        })

        y++;
    })
    .on('close', () => {
        numbers.forEach(n => {
            let isPart = false
            symbols.forEach(s => {
                // check each digit of the number, whether it has a symbol as neighbour
                isPart = isPart || n.pos.reduce((acc, curr) => {
                    return acc || (Math.abs(curr.x - s.x) < 2 && Math.abs(curr.y - s.y) < 2)
                }, false)
            })
            if (isPart) {
                parts.push(n)
            }
        })
        sum = parts.reduce((acc, curr) => (acc + curr.n), 0)
        console.log('part 1', sum)
    })

