const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let answer = 0
let hands = []

rl
    .on('line', (line) => {
        const [hand, bid] = Array.from(line.matchAll(/([AKQJT0-9]+) (\d+)/g)).map(i => [i[1].split(''), Number(i[2])])[0]

        const hyst = hand.map(ch => ({
            ch: ch,
            freq: hand.reduce((acc, curr) => curr === ch ? acc + 1 : acc, 0)
        }))
        let type = {name: 'high', rank: 7}
        if (hyst.find(i => i.freq === 5)) {
            type = {name: 'five', rank: 1}
        } else if (hyst.find(i => i.freq === 4)) {
            type = {name: 'four', rank: 2}
        } else if (hyst.find(i => i.freq === 3) && hyst.find(i => i.freq === 2)) {
            type = {name: 'full', rank: 3}
        } else if (hyst.find(i => i.freq === 3) && !hyst.find(i => i.freq === 2)) {
            type = {name: 'three', rank: 4}
        } else if (hyst.filter(i => i.freq === 2).length === 4) {
            type = {name: 'two', rank: 5}
        } else if (hyst.filter(i => i.freq === 2).length === 2) {
            type = {name: 'one', rank: 6}
        }

        hands.push({hand, bid, type})
    })
    .on('close', () => {
        console.log(hands)

        function sortFnc(a, b) {
            if (a.type.rank === b.type.rank) {
                const chrs = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
                for (let i = 0; i < a.hand.length; i++) {
                    const indexA = chrs.indexOf(a.hand[i])
                    const indexB = chrs.indexOf(b.hand[i])
                    if (indexA != indexB) return indexB - indexA
                }
            }
            if (a.type.rank > b.type.rank) return -1
            return 1
        }

        hands.sort(sortFnc)

        // console.log(hands.map((h, i) => ({
        //     rank: h.type.rank,
        //     hand: h.hand.join(''),
        //     type: h.type.name,
        //     calc: `${h.bid} * ${i+1}`
        // })))

        answer = hands.reduce((acc, curr, i) => acc + (i + 1) * curr.bid, 0)

        console.log('part 1', answer)
    })

