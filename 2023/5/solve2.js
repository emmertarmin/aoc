const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let answer = -1
let stages = []
let seeds = []

rl
    .on('line', (line) => {
        if (line.includes('seeds')) {
            seeds = Array.from(line.matchAll(/(\d+)/g)).map(i => Number(i[1]))
        }

        if (line.includes('-to-')) {
            stages.push({data: [], name: line.match(/-to-(\w+)/)[1]})
            return
        }

        const [ , dest, src, len] = (Array.from(line.matchAll(/(\d+) (\d+) (\d+)/g))[0] || []).map(i => Number(i))
        if (typeof dest === 'undefined') return
        if (stages.length === 0) return

        const last = stages.length - 1

        stages[last].data.push({src, dest, len})
    })
    .on('close', () => {
        stages.forEach((stage, i) => {
            stages[i].data = stage.data.sort((a, b) => (a.src - b.src))
        })

        function check(n) {
            stages.forEach(stage => {
                const map = stage.data.find(m => m.src <= n && (m.src + m.len) > n)
                n = map ? map.dest + (n - map.src) : n
            })
            if (answer === -1 || answer > n) answer = n
            return n
        }

        // console.log(stages[2].data)
        // for (let i = 0; i < 110; i++) {
        //     const map = stages[2].data.find(m => m.src <= i && (m.src + m.len) > i)
        //     console.log(i, map ? map.dest + (i - map.src) : i)

        // }
        // return

        const maxSeed = Math.max(...stages.map(stage => stage.data.reduce((acc, curr) => curr.src + curr.len > acc ? curr.src + curr.len : acc, 0)))

        const interestingSeeds = stages[0].data.map(stage => stage.src)
        console.log({interestingSeeds})

        for (let i = 0; i < seeds.length / 2; i++) {
            const begin = seeds[2*i]
            const end = seeds[2*i] + seeds[2*i + 1]

            for (let n = begin; n < end; n++) {
                if (n%1000000 === 0) console.log(n, answer)
                check(n)
            }

            // const relevant = [begin, ...interestingSeeds.filter(s => begin <= s && s < end)]
            // console.log({relevant})
            // console.log(stages[0].data)

            // relevant.forEach(n => {
            //     console.log('candidate', n)
            //     console.log(check(n))
            // })
        }


        console.log('part 1', answer)
        console.log('not: ', [984064244])
    })

