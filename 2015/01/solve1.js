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

    rows.push(line)
  }

  /* solve task */
  let answer = 0

  console.time('duration')

  rows.forEach(row => {
    console.log('answer 1', sum(row.split('').map(char => char === '(' ? 1 : -1)))
    row.split('').forEach((char, i) => {
        if (char === '(') answer++
        if (char === ')') answer--
        if (answer === -1) console.log('answer 2', i + 1)
    })
  })

    console.log('answer', answer)

  console.timeEnd('duration')
})

