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
  const [eRows, eCols] = expand(space)
  console.log([eRows, eCols])
  draw(space, 'value')
  
  const nodes = []

  space.forEach((row, x) => {
    row.forEach((item, y) => {
      if (item.value === '#') {
        nodes.push({x, y})
      }
    })
  })

  const expansionRate = 1000*1000

  nodes.forEach((node1, i) => {
    nodes.forEach((node2, j) => {
      if (i !== j) {
        const vastCols = eCols.filter(c => Math.min(node1.y, node2.y) < c && c < Math.max(node1.y, node2.y))
        const vastRows = eRows.filter(r => Math.min(node1.x, node2.x) < r && r < Math.max(node1.x, node2.x))
        answer += (Math.abs(node1.x - node2.x) + vastRows.length * (expansionRate - 1) + Math.abs(node1.y - node2.y) + vastCols.length * (expansionRate - 1)) / 2
      }
    })
  })

  console.log('answer', answer, 374, 1030)
})
