const fs = require('fs')
const util = require('util')
const cypto = require('crypto')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('input.txt', 'utf8')
}

const delay = async (ms = 1000) => { await new Promise(r => setTimeout(r, ms)) }

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0)

const draw = (terrain) => {
  console.log()
  terrain.forEach(row => {
    console.log(row.join(''))
  })
  console.log()
}

const getNeighbour = (grid, x, y, dir) => {
  if (dir === 'left' && x > 0) {
    return {value: grid[y][x - 1], x: x - 1, y}
  }
  if (dir === 'right' && x < grid[y].length - 1) {
    return {value: grid[y][x + 1], x: x + 1, y}
  }
  if (dir === 'top' && y > 0) {
    return {value: grid[y - 1][x], x, y: y - 1}
  }
  if (dir === 'bottom' && y < grid.length - 1) {
    return {value: grid[y + 1][x], x, y: y + 1}
  }
  return null
}

const encode = (grid) => {
  const str = grid.map(row => row.join('')).join('')
  return cypto.createHash('md5').update(str).digest('hex')
}

const compute = (grid) => {
  return sum(grid.map((row, i) => (grid.length - i) * sum(row.map(cell => cell === 'O' ? 1 : 0))))
}

let grid = []

/* Can't use `await` outside of an async function so you need to chain with then() */
readInput().then(async data => {
  /* process file */
  for (const line of data.split('\n')) {
    if (line.length === 0) {
      continue
    }

    grid.push(line.split(''))
  }

  /* solve task */
  draw(grid)

  console.time('duration')
  let answer = 0

  const cache = {}
  let loopSize = -1

  const total = 1000*1000*1000 // 1000000000
  for (let i = 0; i < total; i++) {
    const hash = encode(grid)
    if (cache.hasOwnProperty(hash)) {
      cache[hash].cycles.push(i)
      const {value, cycles} = cache[hash]
      if (cycles.length > 1 && loopSize === -1) {
        console.log('loop detected', cycles)
        loopSize = cycles[1] - cycles[0]
        while(i + loopSize < total) { i += loopSize }
        i--
        console.log('jumping to', i)
        continue
      }
    }

    for (dir of ['top', 'left', 'bottom', 'right']) {
      let onceMore = true
      while(onceMore) {
        onceMore = false
        for (const [y, row] of grid.entries()) {
          for (const [x, cell] of row.entries()) {
            if (cell === 'O') {
              const nb = getNeighbour(grid, x, y, dir)
              if (nb?.value === '.') {
                onceMore = true
                grid[nb.y][nb.x] = 'O'
                grid[y][x] = '.'
              }

            }
          }
        }
      }
    }
    cache[hash] = {value: compute(grid), cycles: [i]}
    i%10000 === 0 ? console.log(i, compute(grid)) : null
  }
  draw(grid)

  console.log('cache size', Object.keys(cache).length)

  // console.log(cache)

  answer = compute(grid)

  console.log('answer', answer)

  console.timeEnd('duration')
})

