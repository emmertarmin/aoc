const fs = require('fs')
const util = require('util')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('test.txt', 'utf8')
}

const delay = async (ms = 1000) => { await new Promise(r => setTimeout(r, ms)) }

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0)

const zeroPad = (num, places = 3) => String(num).padStart(places, ' ')

const draw = (arr) => {
  console.log('')
  console.log('')
  console.log(arr.map(row => row.map(i => ` | ${i.value}${i.visited ? '#' : ' '}${zeroPad(i.cost)}`).join('')).join('\n'))
}

const getNeighbours = (arr, x, y) => {
  const neighbours = []
  if (y > 0) {
    neighbours.push({x: x, y: y - 1, dir: 'up'})
  }
  if (y < arr.length - 1) {
    neighbours.push({x: x, y: y + 1, dir: 'down'})
  }
  if (x > 0) {
    neighbours.push({x: x - 1, y: y, dir: 'left'})
  }
  if (x < arr[y].length - 1) {
    neighbours.push({x: x + 1, y: y, dir: 'right'})
  }
  return neighbours
}

const getChain = (arr, x, y) => {
  arr.sort((a, b) => a.cost - b.cost)
  let chain = []
  let current = arr.find(i => i.x === x && i.y === y)
  while (current?.parent) {
    current = arr.find(i => i.x === current.parent.x && i.y === current.parent.y)
    chain.push(current)
  }
  return chain
}

let grid = []

/* Can't use `await` outside of an async function so you need to chain with then() */
readInput().then(async data => {
  /* process file */
  for (const line of data.split('\n')) {
    if (line.length === 0) {
      continue
    }

    grid.push(line.split('').map(i => ({value: +i, data: {'up': {visited: false, cost: Infinity}, 'down': {visited: false, cost: Infinity}, 'left': {visited: false, cost: Infinity}, 'right': {visited: false, cost: Infinity}}})))
  }

  /* solve task */
  console.time('duration')

  // draw(grid)

  const start = {x: 0, y: 0}
  const end = {x: grid[0].length - 1, y: grid.length - 1}

  const open = [{x: start.x, y: start.y, parent: null, data: {'up': {cost: 0}, 'down': {cost: 0}, 'left': {cost: 0}, 'right': {cost: 0}}}]
  const closed = []
  let counter = 0

  while (open.length > 0) {
    open.sort((a, b) => a.cost - b.cost)
    const current = open.shift()

    grid[current.y][current.x].visited = true
    if (grid[current.y][current.x].cost >= 0 && grid[current.y][current.x].cost < current.cost) {console.log('this happened'); continue}
    grid[current.y][current.x].cost = current.cost
    const neighbours = getNeighbours(grid, current.x, current.y)
      .filter(({x, y}) => grid[y][x].visited === false)
      .map(({x, y, dir}) => ({x, y, dir, parent: {x: current.x, y: current.y}, cost: current.cost + grid[y][x].value}))

    for (const neighbour of neighbours) {
      // skip conditions
      if (open.find(i => i.x === neighbour.x && i.y === neighbour.y && i.cost < neighbour.cost)) continue

      // add to open
      open.push(neighbour)
      if (neighbour.x === end.x && neighbour.y === end.y) {
        break
      }
    }

    closed.push(current)
    counter++
    // if (counter%50 === 0) {
    //   console.log(open.length, closed.length)
    //   draw(grid)
    //   await delay(500)
    // }
  }

  console.log('counter', counter)

  grid.forEach((row, y) => row.forEach((_, x) => grid[y][x].visited = false))

  const chain = getChain(closed, end.x, end.y)
  chain.forEach(i => grid[i.y][i.x].visited = true)
  let answer = chain.reduce((acc, curr) => acc + grid[curr.y][curr.x].value, 0)
  console.log('closed.length', closed.length, 'chain.length', chain.length)

  draw(grid)
  console.log('answer', answer)
  console.timeEnd('duration')
})

