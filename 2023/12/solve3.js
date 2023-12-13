const fs = require('fs')
const util = require('util')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('input.txt', 'utf8')
}

let rows = []

const delay = async (ms = 100) => { await new Promise(r => setTimeout(r, ms)) }

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0)

const clean = (str) => {
  while (str.indexOf('00') > -1) {
    str = str.replace('00', '0')
  }
  if (str.startsWith('0')) str = str.substring(1)
  if (str.endsWith('0')) str = str.substring(0, str.length - 1)
  return str
}

/* Can't use `await` outside of an async function so you need to chain with then() */
readInput().then(async data => {
  /* process file */
  for (const line of data.split('\n')) {
    if (line.length === 0) continue

    const med = line.match(/([#\?\.]+) ([\d,]+)/)
    if (med.length === 0) continue
    const nums = med[2].split(',').map(n => Number(n))
    const field = med[1].split('').map(ch => ({'.': 0, '#': 1, '?': 2}[ch])).join('')
    const multiplier = 5
    rows.push({
      field: Array.from(Array(multiplier)).fill(field).join('2'),
      nums: Array.from(Array(multiplier)).fill(nums).reduce((acc, curr) => [...acc, ...curr], [])
    })
  }

  /* solve task */
  console.time('duration')
  let answer = 0

  const checkCache = {}

  const check = (str, nums) => {
    const id = parseInt(str, 3)
    let islands = checkCache[id] || null
    if (!islands) {
      islands = Array.from(str.matchAll(/([1]+)/g)).map(group => group[0].length)
      checkCache[id] = islands
    }
    return nums.length === islands.length && nums.reduce((acc, curr, i) => acc && curr === islands[i], true)
  }

  let cache = {}

  const rec = (str, nums) => {
    str = clean(str)
    const simplify = str.match(/^0*(1+)0(1.*)0*/)
    if (simplify?.[1]?.length > 0 && simplify?.[2]?.length > 0) {
      if (!check(simplify[1], [nums[0]])) return 0
      str = simplify[2]
      nums = nums.slice(1)
    }

    if (!str.includes('2')) { // stop condition
      return check(str, nums) ? 1 : 0
    }
    

    const id = parseInt(str, 3) + '-' + nums.join('-')
    if (cache.hasOwnProperty(id)) return cache[id]

    const i = str.indexOf('2')
    let str1 = str.split('')
    if (i === 0 || i === str1.length - 1) {
      str1.splice(i, 1)
    } else {
      str1.splice(i, 1, '0')
    }
    str1 = str1.join('')
    let str2 = str.split('')
    str2.splice(i, 1, '1')
    str2 = str2.join('')

    const aggr = rec(str1, nums) + rec(str2, nums)
    cache[id] = aggr
    return aggr
  }

  rows.forEach((row, i) => {
    let index = `    ${i}`
    index = index.substring(index.length - 4, index.length)
    console.time(index)
    const solution = rec(row.field, row.nums)
    answer += solution
    console.timeEnd(index)
    console.log('cache size', Object.keys(cache).length)
    cache = {}
  })


  console.log('answer', answer, {'test 1': answer === 21}, {'prod 1': answer === 7204}, {'test 2': answer === 525152}, {'prod 2': answer === 1672318386674})

  console.timeEnd('duration')
})

