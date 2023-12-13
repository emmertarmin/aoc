const fs = require('fs')
const util = require('util')
const { strict } = require('assert')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('input.txt', 'utf8')
}

let rows = []

const delay = async (ms = 100) => { await new Promise(r => setTimeout(r, ms)) }

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
    const multiplier = 5
    rows.push({
      field: Array.from(Array(multiplier)).fill(field).join('?'),
      nums: Array.from(Array(multiplier)).fill(nums).reduce((acc, curr) => [...acc, ...curr], [])
    })
  }

  /* solve task */
  console.time('duration')
  let answer = 0

  const checkCache = {}

  const check = ({str, nums}) => {
    const islands = checkCache[str] || Array.from(str.matchAll(/([#]+)/g)).map(group => group[0].length)
    if (!checkCache[str]) checkCache[str] = islands
    return nums.length === islands.length && nums.reduce((acc, curr, i) => acc && curr === islands[i], true)
  }

  const cache = {}

  const rec = ({str, nums}) => {
    while (str.includes('..')) {
      str = str.replace('..', '.')
    }
    if (str.startsWith('.#')) str = str.substring(1)
    if (str.endsWith('#.')) str = str.substring(0, str.length - 1)
    if (str.endsWith('?.')) str = str.substring(0, str.length - 1)
    const simplify = str.match(/^(\.*#+\.+)(#.*)/)
    if (simplify?.[1]?.length > 0 && simplify?.[2]?.length > 0) {
      if (!check({str: simplify[1], nums: [nums[0]]})) return 0
      str = simplify[2]
      nums = nums.slice(1)
    }

    if (!str.includes('?')) { // stop condition
      return check({str, nums}) ? 1 : 0
    }

    const i = str.indexOf('?')
    let str1 = str.split('')
    str1.splice(i, 1, '#')
    let str2 = str.split('')
    str2.splice(i, 1, '.')

    // if (str.length < 200) {
      const id = str + nums.join('-')
      if (cache[id]) {
        return cache[id]
      } else {
        cache[id] = rec({str: str1.join(''), nums}) + rec({str: str2.join(''), nums})
        return cache[id]
      }
    // }

    return rec({str: str1.join(''), nums}) + rec({str: str2.join(''), nums})
  }

  rows.slice(0, 10).forEach(row => {
    const solution = rec({str: row.field, nums: row.nums})
    console.log(solution, row.field)
    answer += solution
  })

  console.log('answer', answer, [1, 16384, 1, 16, 2500, 506250], 525152, answer === 525152)

  console.timeEnd('duration')
})

