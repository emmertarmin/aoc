const fs = require('fs')
const util = require('util')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('input.txt', 'utf8')
}

const delay = async (ms = 1000) => { await new Promise(r => setTimeout(r, ms)) }

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0)

const zeroPad = (num, places = 3) => String(num).padStart(places, ' ')

const draw = (arr) => {
  console.log('')
  console.log('')
  console.log(arr.map(row => row.map(i => `${i.fill ? '.' : i.current ? '#' : ' '}`).join('').replace(/\|\|/g, '|')).join('\n'))
}

const getNeighbours = (arr, x, y) => {
  const neighbours = []
  if (y > 0) {
    neighbours.push({x: x, y: y - 1, dir: 'U'})
  }
  if (y < arr.length - 1) {
    neighbours.push({x: x, y: y + 1, dir: 'D'})
  }
  if (x > 0) {
    neighbours.push({x: x - 1, y: y, dir: 'L'})
  }
  if (x < arr[y].length - 1) {
    neighbours.push({x: x + 1, y: y, dir: 'R'})
  }
  return neighbours
}

let grid = []
let commands = []

/* Can't use `await` outside of an async function so you need to chain with then() */
readInput().then(async data => {
  /* process file */
  for (const line of data.split('\n')) {
    if (line.length === 0) {
      continue
    }

    const m = line.match(/([UDLR])\s+(\d+)\s+\(([#a-z0-9]+)\)/)
    const [_, dir, steps, color] = m
    commands.push({dir, steps: parseInt(steps), color})
  }

  /* solve task */
  console.time('duration')
  let answer = 0

  let trace = []
  trace.push({x: 0, y: 0, dir: 'U'})

  commands.forEach(command => {
    const {dir, steps, color} = command
    const toLeft = {'U': 'L', 'L': 'D', 'D': 'R', 'R': 'U'}[dir]
    const last = trace[trace.length - 1]
    const {x, y} = last
    let next = {x, y, dir}

    for (let i = 0; i < steps; i++) {
      switch (dir) {
        case 'U':
          next.y -= 1
          break
        case 'D':
          next.y += 1
          break
        case 'L':
          next.x -= 1
          break
        case 'R':
          next.x += 1
          break
      }
      trace.push({x: next.x, y: next.y, dir: next.dir})
    }
  })

  const minX = Math.min(...trace.map(i => i.x))
  const maxX = Math.max(...trace.map(i => i.x))
  const minY = Math.min(...trace.map(i => i.y))
  const maxY = Math.max(...trace.map(i => i.y))

  const width = maxX - minX + 1
  const height = maxY - minY + 1

  const grid = JSON.parse(JSON.stringify(Array(height).fill().map(() => Array(width).fill({visited: false}))))

  trace.forEach((step, i) => {
    const {x, y, dir} = step
    trace[i].x = x - minX
    trace[i].y = y - minY
  })
  trace.forEach((step, i) => {
    const {x, y, dir} = step
    grid[y][x] = {visited: true, dir}
  })

  let prevStep = null
  for await (const step of trace) {
    const {x, y, dir} = step
    const toRight = {'U': 'R', 'R': 'D', 'D': 'L', 'L': 'U'}[dir]

    if (prevStep?.dir && prevStep.dir !== dir) {
      let nb = getNeighbours(grid, prevStep.x, prevStep.y).find(i => i.dir === toRight)
      grid[y][x].current = true
      while (!grid[nb.y][nb.x].visited) {
        grid[nb.y][nb.x].fill = true
        nb = getNeighbours(grid, nb.x, nb.y).find(i => i.dir === toRight)
        if (!nb) break
      }
    }

    let nb = getNeighbours(grid, x, y).find(i => i.dir === toRight)
    grid[y][x].current = true
    while (!grid[nb.y][nb.x].visited) {
      grid[nb.y][nb.x].fill = true
      nb = getNeighbours(grid, nb.x, nb.y).find(i => i.dir === toRight)
      if (!nb) break
    }

    // await delay(250)
    // draw(grid.slice(100, 200).map(row => row.slice(0, 100)))
    // draw(grid.map(row => row))
    prevStep = step
  }

  answer = grid.reduce((acc, curr) => acc + curr.filter(i => i.visited || i.fill).length, 0)

  draw(grid)

  console.log('answer', answer)
  console.timeEnd('duration')
})

