const fs = require('fs')
const util = require('util')

const { draw, expand } = require('./use.js')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('input.txt', 'utf8')
}

let answer = 0
let space = []

const delay = async (ms = 100) => { await new Promise(r => setTimeout(r, ms)) }

/* Can't use `await` outside of an async function so you need to chain with then() */
readInput().then(async data => {
  /* process file */
  for (const line of data.split('\n')) {
    space.push(line.split('').map(e => ({
      value: e
    })))
    if (line.length === 0) {
      continue
    }
  }

  /* solve task */
  space = expand(space)
  draw(space, 'value')
  
  const nodes = []

  space.forEach((row, x) => {
    row.forEach((item, y) => {
      if (item.value === '#') {
        nodes.push({x, y})
      }
    })
  })

  nodes.forEach((node1, i) => {
    nodes.forEach((node2, j) => {
      if (i !== j) {
        answer += (Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y)) / 2
      }
    })
  })

  console.log('answer', answer)
})
