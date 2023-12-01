const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let sum = 0

const digitMap = new Map([
    ['zero', 0],
    ['one', 1],
    ['two', 2],
    ['three', 3],
    ['four', 4],
    ['five', 5],
    ['six', 6],
    ['seven', 7],
    ['eight', 8],
    ['nine', 9]
])

rl
    .on('line', (line) => {
        const digits = Array
            .from(line.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g))
            .filter(d => {
                if (d.length === 0) return false
                return true
            })
            .map(infos => {
                const d = infos[1]
                if (d.length === 1) return Number(d)
                return Number(digitMap.get(d))
            })
        const generatedNumber = 10*Number(digits[0]) + Number(digits[digits.length - 1])
        sum += generatedNumber
    })
    .on('close', () => {
        console.log('part 2', sum)
    })
