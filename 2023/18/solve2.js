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
  console.log(arr.map(row => row.map(i => `${i.fill ? '.' : i.current ? '#' : ' '}`).join('').replace(/\|\|/g, '|')).join('\n'))
  console.log('')
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

function calculateArea(coords) {
  let area = 0;

  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i]
    const [x2, y2] = coords[(i + 1) % coords.length]

    area += x1 * y2 - x2 * y1
  }

  return area / 2
  // replace with
  // return Math.abs(area) / 2;
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

    const [__, actualStepsHex, actualDirIndex] = color.match(/#([a-z0-9]{5})([0-3]{1})/)
    const actualSteps = parseInt(actualStepsHex, 16)
    const actualDir = {'0': 'R', '1': 'D', '2': 'L', '3': 'U'}[actualDirIndex]

    // commands.push({dir, steps: parseInt(steps)}) // 0.7510685
    commands.push({dir: actualDir, steps: actualSteps})
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

    switch (dir) {
      case 'U':
        next.y -= steps
        break
      case 'D':
        next.y += steps
        break
      case 'L':
        next.x -= steps
        break
      case 'R':
        next.x += steps
        break
    }
    trace.push({x: next.x, y: next.y, dir: next.dir})
  })


  const minX = Math.min(...trace.map(i => i.x))
  const maxX = Math.max(...trace.map(i => i.x))
  const minY = Math.min(...trace.map(i => i.y))
  const maxY = Math.max(...trace.map(i => i.y))

  const width = maxX - minX + 1
  const height = maxY - minY + 1

  // const grid = JSON.parse(JSON.stringify(Array(height).fill().map(() => Array(width).fill({visited: false}))))

  trace.forEach((step, i) => {
    const {x, y, dir} = step
    trace[i].x = x - minX
    trace[i].y = y - minY
  })

  const perimeter = commands.reduce((acc, curr) => acc + curr.steps, 0)

  const area = calculateArea(trace.map(i => [i.x, i.y])) - perimeter/2 + 1

  console.log('area', area, 'perimeter', perimeter, 'sum', area + perimeter)

  // answer = grid.reduce((acc, curr) => acc + curr.filter(i => i.visited || i.fill).length, 0)

  // draw(grid)

  console.log('answer', answer)
  console.timeEnd('duration')
})

