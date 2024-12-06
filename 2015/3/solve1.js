const fs = require('fs')
const util = require('util')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('input.txt', 'utf8')
}

let rows = []

const delay = async (ms = 100) => { await new Promise(r => setTimeout(r, ms)) }

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0)

/* Can't use `await` outside of an async function so you need to chain with then() */
readInput().then(async data => {
  /* process file */
  for (const line of data.split('\n')) {
    if (line.length === 0) continue
console.log(line.split(''))
    rows.push(line.split('').map(ch => ({'^': {x: 0, y: 1},'>': {x: 1, y: 0},'v': {x: 0, y: -1},'<': {x: -1, y: 0}}[ch])))
  }

  /* solve task */
  let visited_a = new Set()
  let visited_b = new Set()

  console.time('duration')

  visited_a.add('0,0')
  rows.forEach(row => {
    let x = 0
    let y = 0

    row.forEach(ch => {
      x += ch.x
      y += ch.y

      visited_a.add(`${x},${y}`)
    })

    let people = [{x: 0, y: 0}, {x: 0, y: 0}]

    row.forEach((ch, i) => {
      people[i % 2].x += ch.x
      people[i % 2].y += ch.y

      visited_b.add(`${people[i % 2].x},${people[i % 2].y}`)
    })
  })

  console.log('visited_a', visited_a.size)
  console.log('visited_b', visited_b.size)

  console.timeEnd('duration')
})

