const fs = require('fs')
const util = require('util')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('input.txt', 'utf8')
}

const delay = async (ms = 1000) => { await new Promise(r => setTimeout(r, ms)) }

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0)

let arr = []

/* Can't use `await` outside of an async function so you need to chain with then() */
readInput().then(async data => {
  /* process file */
  for (const line of data.split('\n')) {
    if (line.length === 0) {
      continue
    }

    arr.push(line.split(','))
    arr = arr.reduce((acc, curr) => acc.concat(curr), [])
  }

  /* solve task */
  console.log(arr)

  console.time('duration')
  let answer = 0

  arr.forEach(str => {
    answer += str.split('').reduce((acc, curr) => {
      // step 1: get ascii code of str
      const ascii = curr.charCodeAt(0)
      // step 2: increase value by curr
      acc += ascii
      // step 3: multiply by 17
      acc *= 17
      // step 4: get remainder of 256
      acc %= 256
      return acc
    }, 0)
  })

  console.log('answer', answer)

  console.timeEnd('duration')
})

