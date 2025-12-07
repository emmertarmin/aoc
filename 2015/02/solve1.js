const fs = require('fs')
const util = require('util')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('input.txt', 'utf8')
}

let answer = 0
let rows = []

const delay = async (ms = 100) => { await new Promise(r => setTimeout(r, ms)) }

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0)

/* Can't use `await` outside of an async function so you need to chain with then() */
readInput().then(async data => {
  /* process file */
  for (const line of data.split('\n')) {
    if (line.length === 0) continue

    rows.push(line.split('x').map(Number))
  }

  /* solve task */
  let paper = 0
  let ribbon = 0

  console.time('duration')

  rows.forEach(row => {
    const [l, w, h] = row
    const [a, b, c] = [l * w, w * h, h * l]
    const [x, y, z] = [2 * a, 2 * b, 2 * c]
    const min1 = Math.min(a, b, c)
    paper += x + y + z + min1

    const min2 = Math.min(l + w, w + h, h + l)
    ribbon += min2 * 2 + l * w * h
  })

  console.log('paper', paper)
  console.log('ribbon', ribbon)

  console.timeEnd('duration')
})

