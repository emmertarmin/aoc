const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let answer = 0
let instructions = []
let nodes = []

rl
    .on('line', (line) => {
        if (line.match(/^[LR]+$/)) {
            instructions = line.split('')
            // console.log(instructions)
            return
        }

        if (line.includes(' = ')) {
            const [_, name, left, right] = Array.from(line.match(/([0-9A-Z]+) = \(([0-9A-Z]+), ([0-9A-Z]+)\)/))
            nodes.push({name, left, right})
        }


        // const [hand, bid] = Array.from(line.matchAll(/([AKQJT0-9]+) (\d+)/g)).map(i => [i[1].split(''), Number(i[2])])[0]

    })
    .on('close', () => {
        let node = nodes.filter(n => n.name === 'AAA')
        console.log(node)
        for (let i = 0; i < 1000*1000*1000; i++) {
            if (i%100000 === 0) console.log(i, node.map(n => n.name))
            const dir = instructions[i%instructions.length]
            node = node.map(n => {
                return dir === 'L' ? nodes.find(item => item.name === n.left) : nodes.find(item => item.name === n.right)
            })
            answer += 1
            if (node.reduce((acc, curr) => acc && curr.name === 'ZZZ', true)) break
        }

        console.log('part 1', answer)
    })

