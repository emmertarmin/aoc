const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('test.txt')
});

let answer = 0
let instructions = []
let nodes = []

rl
    .on('line', (line) => {
        if (line.match(/^[LR]+$/)) {
            instructions = line.split('')
            console.log(instructions)
            return
        }

        if (line.includes(' = ')) {
            const [_, name, left, right] = Array.from(line.match(/([A-Z]+) = \(([A-Z]+), ([A-Z]+)\)/))
            nodes.push({name, left, right})
        }

        // const [hand, bid] = Array.from(line.matchAll(/([AKQJT0-9]+) (\d+)/g)).map(i => [i[1].split(''), Number(i[2])])[0]

    })
    .on('close', () => {
        let node = nodes.find(n => n.name === 'AAA')
        for (let i = 0; i < 1000; i++) {
            const dir = instructions[i%instructions.length]
            node = dir === 'L' ? nodes.find(n => n.name === node.left) : nodes.find(n => n.name === node.right)
            answer += 1
            if (node.name === 'ZZZ') break
        }
        console.log(nodes)

        console.log('part 1', answer)
    })

