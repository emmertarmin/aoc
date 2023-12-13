const fs = require('fs')
const util = require('util')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('input.txt', 'utf8')
}

const delay = async (ms = 1000) => { await new Promise(r => setTimeout(r, ms)) }

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0)

const draw = (terrain) => {
  terrain.forEach(row => {
    console.log(row.map(i => i ? ' #' : ' .').join(''))
  })
}

let maps = [[]]

/* Can't use `await` outside of an async function so you need to chain with then() */
readInput().then(async data => {
  /* process file */
  for (const line of data.split('\n')) {
    if (line.length === 0) {
      maps.push([])
      continue
    }

    maps[maps.length - 1].push(line.split('').map(i => i === '#' ? 1 : 0))
  }

  /* solve task */
  
  console.time('duration')

  const bitCount = (n) => n.toString(2).match(/1/g)?.length || 0

  function findSymmetry(rows) {
    for (let x = 1; x < rows.length; x++) {
      const maxLen = Math.min(x, rows.length - x)
      const toLeft = [...rows].slice(x - maxLen, x)
      const toRight = [...rows].slice(x, x + maxLen).reverse()
      let hamming = 0
      for (let i = 0; i < toLeft.length; i++) {
        hamming += bitCount(toLeft[i] ^ toRight[i])
        // console.log(toLeft, toRight, bitCount(toLeft[i] ^ toRight[i]))
      }
      if (hamming === 1) return x
    }
    return 0
  }

  let answer = 0
  
  for (const m of maps) {
    const rows = m.map(row => parseInt(row.reduce((acc, curr) => `${acc}${curr}`, ''), 2))
    const cols = m[0].map((col, i) => parseInt(m.reduce((acc, curr) => `${acc}${curr[i]}`, ''), 2))

    // draw(m)

    const x = findSymmetry(rows)

    const y = findSymmetry(cols)

    answer += 100*x + y

    // draw(m)
    // console.log(x, y)
    // await delay(2000)

    // if (x === 0 && y === 0) {
    //   draw(m)
    //   console.log(x, y)
    //   await delay(2000)
    // }

  }
  
  console.log('answer', answer, 33735)

  console.timeEnd('duration')
})

