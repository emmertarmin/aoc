const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let answer = []
let times = []
let dists = []

rl
    .on('line', (line) => {
        if (line.includes('Time')) {
            times = Array.from(line.matchAll(/(\d+)/g)).map(i => Number(i[1]))
            times = [Number(times.reduce((acc, curr) => acc.concat(String(curr)), ''))]
            console.log(times)
        }
        if (line.includes('Distance')) {
            dists = Array.from(line.matchAll(/(\d+)/g)).map(i => Number(i[1]))
            dists = [Number(dists.reduce((acc, curr) => acc.concat(String(curr)), ''))]
            console.log(dists)
        }
    })
    .on('close', () => {
        times.forEach((time, i) => {
            answer.push(0)
            const record = dists[i]

            for (let t = 0; t < time; t++) {
                const dist = (time - t) * t
                // console.log(t, dist)
                if (dist > record) answer[answer.length - 1] += 1
            }
        })

        console.log('part 1', answer.reduce((acc, curr) => acc*curr, 1))
    })

