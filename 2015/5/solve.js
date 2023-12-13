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

    rows.push(line)
  }

  /* solve task */
  let answer_a = 0
  let answer_b = 0

  console.time('duration')

  rows.forEach(row => {
    const vowels = row.match(/[aeiou]/g)?.length > 2
    const twice = row.match(/(.)\1/) !== null
    const bad = row.match(/ab|cd|pq|xy/) !== null

    if (vowels && twice && !bad) {
      answer_a++
    }
  })

  rows.forEach(row => {
    const twice = row.match(/(..).*\1/) !== null
    const repeat = row.match(/(.).\1/) !== null

    if (twice && repeat) {
      answer_b++
    }
  })

  console.log('answer_a', answer_a)
  console.log('answer_b', answer_b)

  console.timeEnd('duration')
})
