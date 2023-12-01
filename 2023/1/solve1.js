const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let sum = 0

rl
    .on('line', (line) => {
        const digits = line.match(/(\d)/g)
        const generatedNumber = 10*Number(digits[0]) + Number(digits[digits.length - 1])
        sum += generatedNumber
    })
    .on('close', () => {
        console.log('part 1', sum)
    })
