const fs = require('fs')
const util = require('util')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('test1.txt', 'utf8')
}

let rows = []

const delay = async (ms = 100) => { await new Promise(r => setTimeout(r, ms)) }

const genString = (arr) => {
  return arr.map((part, i) => i%2 ? Array.from(Array(part)).fill('#').join('') : Array.from(Array(part)).fill('.').join('')).join('')
}

const checkString = (str1, str2) => {
  if (str1.length !== str2.length) throw `string lengths don\'t match: ${str1.length} vs. ${str2.length}`
  
  let match = true
  
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] === '#' && str2[i] === '.') match = false
    if (str2[i] === '#' && str1[i] !== '#') match = false
  }
  // console.log(str1, str2, match)
  return match
}

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0)


/* Can't use `await` outside of an async function so you need to chain with then() */
readInput().then(async data => {
  /* process file */
  for (const line of data.split('\n')) {
    if (line.length === 0) continue

    const med = line.match(/([#\?\.]+) ([\d,]+)/)
    if (med.length === 0) continue
    const nums = med[2].split(',').map(n => Number(n))
    const field = med[1]
    const multiplier = 1
    rows.push({
      field: Array.from(Array(multiplier)).fill(field).join('?'),
      nums: Array.from(Array(multiplier)).fill(nums).reduce((acc, curr) => [...acc, ...curr], [])
    })
  }

  /* solve task */
  let checked = {}

  console.time('duration')
  let answer = 0

  rows.forEach(row => {
    const len = row.field.length
    let init = []
    init.push(0)
    row.nums.forEach(num => init.push(num, 1))
    init[init.length - 1] = 0
    const leftover = len - sum(init)

    function rec (surplus, buckets, arr) {
      if (surplus === 0) {
        const str = genString(arr)
        if (!checked[str]) {
          checked[str] = 1
          return checkString(str, row.field) ? 1 : 0
        }
        return 0
      }
      // console.log(surplus, sum(arr), genString(arr))
      let works = 0
      for (let i = 0; i < buckets/2; i++) {
        const newArr = [...arr]
        newArr[2*i] += 1
        works += rec(surplus - 1, buckets, newArr)
      }
      return works
    }

    checked = {}
    const debug = rec(leftover, init.length, init)
    answer += debug
    console.log(debug, row.field)
  })
  
    console.log('answer', answer)

  console.timeEnd('duration')
})

