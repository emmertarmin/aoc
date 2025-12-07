const fs = require('fs')
const util = require('util')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('input.txt', 'utf8')
}

let rows = []

let grid = Array(1000).fill().map(() => Array(1000).fill(0))

const delay = async (ms = 100) => { await new Promise(r => setTimeout(r, ms)) }

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0)

/* Can't use `await` outside of an async function so you need to chain with then() */
readInput().then(async data => {
  /* process file */
  for (const line of data.split('\n')) {
    if (line.length === 0) continue

    const [action, from, to] = line.match(/(turn on|turn off|toggle) (\d+,\d+) through (\d+,\d+)/).slice(1)
    rows.push({ action, from, to })
  }

  /* solve task */
  console.log(rows)
  let answer = 0

  console.time('duration')

  rows.forEach(row => {
    const [x1, y1] = row.from.split(',').map(Number)
    const [x2, y2] = row.to.split(',').map(Number)

    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        switch (row.action) {
          case 'turn on':
            grid[x][y] += 1
            break
          case 'turn off':
            grid[x][y] = Math.max(0, grid[x][y] - 1)
            break
          case 'toggle':
            grid[x][y] += 2
            break
        }
      }
    }
  })

  answer = sum(grid.map(row => sum(row)))

  console.log('answer', answer)

  console.timeEnd('duration')
})
