const fs = require('fs')
const util = require('util')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('input.txt', 'utf8')
}

const delay = async (ms = 1000) => { await new Promise(r => setTimeout(r, ms)) }

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0)

const draw = (arr) => {
  console.log('')
  console.log(arr.map(row => row.map(i => ` ${i.lens}${i.dir}`).join('')).join('\n'))
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

let gridOrigin = []

/* Can't use `await` outside of an async function so you need to chain with then() */
readInput().then(async data => {
  /* process file */
  for (const line of data.split('\n')) {
    if (line.length === 0) {
      continue
    }

    gridOrigin.push(line.split('').map(i => ({lens: i, visited: {up: 0, right: 0, down: 0, left: 0, yes: 0}, dir: ' '})))
  }

  /* solve task */
  draw(gridOrigin)

  console.time('duration')

  const allStartBeamsTop = gridOrigin[0].map((i, index) => ({x: index, y: 0, dir: 'down'}))
  const allStartBeamsBottom = gridOrigin[gridOrigin.length - 1].map((i, index) => ({x: index, y: gridOrigin.length - 1, dir: 'up'}))
  const allStartBeamsLeft = gridOrigin.map((i, index) => ({x: 0, y: index, dir: 'right'}))
  const allStartBeamsRight = gridOrigin.map((i, index) => ({x: gridOrigin[0].length - 1, y: index, dir: 'left'}))

  let answer = 0

  for (startBeam of [...allStartBeamsTop, ...allStartBeamsBottom, ...allStartBeamsLeft, ...allStartBeamsRight]) {
    const grid = JSON.parse(JSON.stringify(gridOrigin))

    let currBeams = [startBeam]
    let nextBeams = []

    // process one step
    while (currBeams.length > 0) {
      while (currBeams.length > 0) {
        const {x, y, dir} = currBeams.shift()
        const curr = grid[y][x]
        if (curr.visited[dir] > 0) continue
        curr.visited[dir]++
        curr.visited.yes++
        curr.dir = {up: '↑', down: '↓', left: '←', right: '→'}[dir]

        if (
          (curr.lens === '.')
          || (curr.lens === '-' && (dir === 'left' || dir === 'right'))
          || (curr.lens === '|' && (dir === 'up' || dir === 'down'))
        ) {
          // console.log('continue')
          const nb = [getNeighbours(grid, x, y).find(i => i.dir === dir)]
          nextBeams.push(...nb.filter(i => i))
        }

        if ((curr.lens === '/' && dir === 'up') || (curr.lens === '\\' && dir === 'down')) {
          // console.log('continue right')
          const nb = [getNeighbours(grid, x, y).find(i => i.dir === 'right')]
          nextBeams.push(...nb.filter(i => i))
        }

        if ((curr.lens === '/' && dir === 'down') || (curr.lens === '\\' && dir === 'up')) {
          // console.log('continue left')
          const nb = [getNeighbours(grid, x, y).find(i => i.dir === 'left')]
          nextBeams.push(...nb.filter(i => i))
        }

        if ((curr.lens === '/' && dir === 'left') || (curr.lens === '\\' && dir === 'right')) {
          // console.log('continue down')
          const nb = [getNeighbours(grid, x, y).find(i => i.dir === 'down')]
          nextBeams.push(...nb.filter(i => i))
        }

        if ((curr.lens === '/' && dir === 'right') || (curr.lens === '\\' && dir === 'left')) {
          // console.log('continue up')
          const nb = [getNeighbours(grid, x, y).find(i => i.dir === 'up')]
          nextBeams.push(...nb.filter(i => i))
        }

        if (curr.lens === '-' && (dir === 'up' || dir === 'down')) {
          // console.log('split left/right')
          const nb = [
            getNeighbours(grid, x, y).find(i => i.dir === 'left'),
            getNeighbours(grid, x, y).find(i => i.dir === 'right')
          ]
          nextBeams.push(...nb.filter(i => i))
        }

        if (curr.lens === '|' && (dir === 'left' || dir === 'right')) {
          // console.log('split up/down')
          const nb = [
            getNeighbours(grid, x, y).find(i => i.dir === 'up'),
            getNeighbours(grid, x, y).find(i => i.dir === 'down')
          ]
          nextBeams.push(...nb.filter(i => i))
        }
      }
      currBeams = [...nextBeams]
      nextBeams = []
    }
    const active = grid.reduce((acc, curr) => acc + sum(curr.map(i => i.visited.yes ? 1 : 0)), 0)
    if (active > answer) {
      answer = active
    }
  }

  console.log('answer', answer)

  console.timeEnd('duration')
})

