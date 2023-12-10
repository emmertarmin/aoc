const fs = require('fs');
const util = require('util');
const { get, set, draw, wait, getConnectingNeighbours } = require('./helpers');

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

function getStuff() {
  return readFile('test2.txt', 'utf8');
}

let answer = 0
let map = []
let start = undefined
let queue = []

// Can't use `await` outside of an async function so you need to chain
// with then()
getStuff().then(async data => {
  // process file
  for (const line of data.split('\n')) {
    const elements = line.split('')
    map.push(elements.map(i => ({
      type: i,
      dist: 0,
      visited: 0
    })))
    if (elements.indexOf('S') > -1) {
      start = { x: map.length - 1, y: elements.indexOf('S') }
    }
  }

  // solve task
  await draw(map)

  queue.push([start])

  let dist = -1
  while (queue.length > 0) {
    dist++
    const points = queue.shift()
    let arr = []
    for (const point of points) {
      set(map, 'visited', point.x, point.y, 1)
      set(map, 'dist', point.x, point.y, dist)
      const neighbours = getConnectingNeighbours(map, point.x, point.y).filter(i => get(map, i.x, i.y).visited === 0)
      draw(map, 'dist')
      await wait(500)
      arr = [...arr, ...neighbours]
    }
    if (arr.length > 0) {
      queue.push(arr)
    }
  }

  draw(map, 'visited')

  answer = dist

  console.log('answer', answer)
})
