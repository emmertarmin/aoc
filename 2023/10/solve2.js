const fs = require('fs');
const util = require('util');
const { get, set, draw, wait, getConnectingNeighbours, getAllNeighbours } = require('./helpers');

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

function getStuff() {
  return readFile('input.txt', 'utf8');
}

let answer = 0
let map = []
let start = undefined
let queue = []

const dirs = []

// Can't use `await` outside of an async function so you need to chain
// with then()
getStuff().then(async data => {
  // process file
  for (const line of data.split('\n')) {
    if (line.length === 0) {
      continue
    }
    const elements = line.split('')
    map.push(elements.map((i, y) => ({
      type: i,
      visited: 0,
      direction: '  .',
      side: {x: 0, y: 1},
      marked: '.'
    })))
    if (elements.indexOf('S') > -1) {
      start = { x: map.length - 1, y: elements.indexOf('S') }
    }
  }

  // solve task
  // await draw(map)

  queue.push([start])
  let dir = 1
  let prev = start


  while (queue.length > 0) {
    const points = queue.shift()
    let arr = []
    for (const point of points) {
      /* handle single point */
      set(map, 'visited', point.x, point.y, 1)
      const neighbours = getConnectingNeighbours(map, point.x, point.y).filter(i => get(map, i.x, i.y).visited === 0)[0] || undefined
      if (neighbours) {
        arr = [...arr, neighbours]
      }
      let delta = 0
      if (point.x < prev.x) {delta = {'F': -1, '|': 0, '7': 1}[get(map, point.x, point.y).type]}
      if (point.x > prev.x) {delta = {'J': -1, '|': 0, 'L': 1}[get(map, point.x, point.y).type]}
      if (point.y < prev.y) {delta = {'L': -1, '-': 0, 'F': 1}[get(map, point.x, point.y).type]}
      if (point.y > prev.y) {delta = {'7': -1, '-': 0, 'J': 1}[get(map, point.x, point.y).type]}
      dir = (dir + delta + 4) % 4
      set(map, 'direction', point.x, point.y, `  ${dir}`.substring(-3))
      // rotate "side" coordinates
      let side = get(map, prev.x, prev.y).side
      set(map, 'side', point.x, point.y, side)

      set(map, 'marked', point.x + side.x, point.y + side.y, 'I')
      set(map, 'marked', point.x - side.x, point.y - side.y, 'O')
      if (delta !== 0) {
        const tmp = side.x
        side.x = -1 * delta * side.y
        side.y = delta * tmp
        set(map, 'marked', point.x + side.x, point.y + side.y, 'I')
        set(map, 'marked', point.x - side.x, point.y - side.y, 'O')
      }

      // draw(map, 'direction')
      // draw(map, 'marked')
      prev = point
      // await wait(1)
    }
    if (arr.length > 0) {
      queue.push(arr)
    }
  }

  map.forEach((row, x) => {
    row.forEach((point, y) => {
      if (point.visited === 1) {
        set(map, 'marked', x, y, '.')
      }
      if (!point.visited && point.marked === '.') {
        set(map, 'marked', x, y, 'X')
      }
    })
  })
  map.forEach((row, x) => {
    row.forEach((point, y) => {
      if (point.marked === 'X') {
        if (getAllNeighbours(map, x, y).find(i => get(map, i.x, i.y).marked === 'I')) {
          set(map, 'marked', x, y, 'I')
        }
      }
    })
  })

  await draw(map, 'marked')
  // await draw(map, 'visited')

  answer = map.reduce((acc, row) => {
    return acc + row.filter(i => i.marked === 'I').length
  }, 0)

  console.log('answer', answer)
})
