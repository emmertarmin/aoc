const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let answer = 0
let instructions = []
let nodes = new Map()

rl
    .on('line', (line) => {
        if (line.match(/^[LR]+$/)) {
            instructions = line.split('')
            // console.log(instructions)
            return
        }

        if (line.includes(' = ')) {
            const [_, name, left, right] = Array.from(line.match(/([0-9A-Z]+) = \(([0-9A-Z]+), ([0-9A-Z]+)\)/))
            nodes.set(name, {L: left, R: right, name: name, z: name.endsWith('Z')})
        }


        // const [hand, bid] = Array.from(line.matchAll(/([AKQJT0-9]+) (\d+)/g)).map(i => [i[1].split(''), Number(i[2])])[0]

    })
    .on('close', () => {
        let node = Array.from(nodes.keys()).filter(n => n.endsWith('A')).map(n => nodes.get(n))
        for (let i = 0; i < 1000*1000*1000*1000; i++) {
            if (i%1000000 === 0) console.log(i/1000000, node.map(n => n.name))
            const dir = instructions[i%instructions.length]
            node = node.map(n => nodes.get(n[dir]))
            answer += 1
            if (!node.find(n => !n.z)) break
        }

        console.log('part 1', answer)
    })

