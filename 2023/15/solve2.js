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
const boxes = JSON.parse(JSON.stringify(Array.from(Array(256).fill([]))))

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
  console.time('duration')
  let answer = 0
  let hash = 0

  arr.forEach((str, i) => {
    const operation = str.match(/(=|-)/)[0]
    const label = str.split(operation)[0]
    const lens = str.split(operation)[1]

    hash = label.split('').reduce((acc, curr) => {
      const ascii = curr.charCodeAt(0)
      acc += ascii
      acc *= 17
      acc %= 256
      return acc
    }, 0)

    const content = `${label} ${lens}`

    if (operation === '=') {
      if (boxes[hash].filter(box => box.startsWith(label)).length > 0) {
        // console.log(`${str}: replacing "${label}" in box ${hash}`)
        // console.log(boxes[hash])
        for (let i = 0; i < boxes[hash].length; i++) {
          if (boxes[hash][i].startsWith(label)) {
            boxes[hash][i] = content
          }
        }
        // boxes[hash][boxes[hash].findIndex(box => box.startsWith(label))] = content
      } else {
        // console.log(`${str}: adding "${label}" to box ${hash}`)
        boxes[hash].push(content)
      }
    }
    if (operation === '-') {
      // console.log(`${str}: removing "${label}" from box ${hash}`)
      boxes[hash] = JSON.parse(JSON.stringify(boxes[hash].filter(box => !box.startsWith(label))))
    }

    // console.log(boxes.slice(0, 4).map((box, n) => `  ${n}: ${box.join(',')}`).join('\n'))
    // console.log('--------------------------')
  })

  console.log(boxes.map((box, n) => `  ${n}: ${box.join(',')}`).join('\n'))

  boxes.forEach((box, i) => {
    box.forEach((lens, j) => {
      console.log(`${i+1} * ${j+1} * ${lens.split(' ')[1]} = ${(1+i) * (1+j) * lens.split(' ')[1]}`)
      answer += (1+i) * (1+j) * lens.split(' ')[1]
    })
  })


  console.log('answer', answer, 48314)

  console.timeEnd('duration')
})

