const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let answer = 0
let stages = []
let seeds = []
let locs = []

rl
    .on('line', (line) => {
        if (line.includes('seeds')) {
            seeds = Array.from(line.matchAll(/(\d+)/g)).map(i => Number(i[1]))
            // console.log(seeds)
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
        
        
        
        // console.log(stages[2].data)
        // for (let i = 0; i < 110; i++) {
        //     const map = stages[2].data.find(m => m.src <= i && (m.src + m.len) > i)
        //     console.log(i, map ? map.dest + (i - map.src) : i)

        // }
        // return


        
        locs = seeds.map(seed => {
            let n = seed
            // console.log('')
            // console.log(`seed: ${seed}`)
            stages.forEach(stage => {
                const map = stage.data.find(m => m.src <= n && (m.src + m.len) > n)
                n = map ? map.dest + (n - map.src) : n
                // console.log(stage.name, n)
            })
            return n
        })
        // console.log(seeds, 'seeds')
        // console.log(locs, 'locations')
        // console.log([82, 43, 86, 35], 'solution of test')
        answer = Math.min(...locs)
        console.log('part 1', answer)
    })

