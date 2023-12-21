const fs = require('fs')
const util = require('util')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('test.txt', 'utf8')
}

const delay = async (ms = 1000) => { await new Promise(r => setTimeout(r, ms)) }

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0)

const zeroPad = (num, places = 3) => String(num).padStart(places, ' ')

let rules = {}
let parts = []

/* Can't use `await` outside of an async function so you need to chain with then() */
readInput().then(async data => {
  /* process file */
  for (const line of data.split('\n')) {
    if (line.length === 0) {
      continue
    }

    if (line.startsWith('{')) {
      const [_, partString] = line.match(/{(.*)}/)
      const part = partString.split(',').map(i => i.trim().split('=')).reduce((acc, curr) => ({...acc, [curr[0]]: parseInt(curr[1])}), {})
      parts.push(part)
    } else {
      const [_, name, rulesString] = line.match(/(\w+){(.*)}/)
      const rule = rulesString.split(',').map(i => i.trim())
      rules[name] = rule
    }
  }
  // console.log(parts.slice(0, 5), Object.keys(rules).slice(0, 5).map(k => ({name: k, rules: rules[k]})))

  /* solve task */
  console.time('duration')
  let answer = 0

  function rec(part, ruleName) {
    const ruleArr = rules[ruleName]
    // console.log(part, ruleName, ruleArr)

    if (ruleName === 'A') return true
    if (ruleName === 'R') return false

    for (const rule of ruleArr) {
      if (rule === 'A') return true
      if (rule === 'R') return false

      if (!rule.split('').includes(':')) {
        // console.log('fallback', rule)
        return rec(part, rule)
      }

      const [test, dest] = rule.split(':')
      const [_, partName, comp, num] = test.match(/(\w+)([<>])(\d+)/)
      // console.log(test, `${part[partName]}${comp}${num}`, dest, comp === '<' && part[partName] < num || comp === '>' && part[partName] > num)
      if (comp === '<' && part[partName] < parseInt(num)) return rec(part, dest)
      if (comp === '>' && part[partName] > parseInt(num)) return rec(part, dest)
    }
  }

  // const acceptedParts = parts.filter(part => rec(part, 'in'))

  let acceptedParts = 0
  let rejectedParts = 0

  let ranges = [
    [1, 4000],
    [1, 4000],
    [1, 4000],
    [1, 4000]
  ]

  let acceptedRanges = [
    [1, 4000],
    [1, 4000],
    [1, 4000],
    [1, 4000]
  ]

  const step = 100

  const diff = (arr) => Math.max(...arr) - Math.min(...arr)
  const middle = (arr) => Math.min(...arr) + Math.floor(diff(arr) / 2)
  const copy = (obj) => JSON.parse(JSON.stringify(obj))

  for (let s = ranges[3][0]; s <= ranges[3][1]; s += step) {
    for (let a = ranges[2][0]; a <= ranges[2][1]; a += step) {
      for (let m = ranges[1][0]; m <= ranges[1][1]; m += step) {
        for (let x = ranges[0][0]; x <= ranges[0][1]; x += step) {
          const part = {x, m, a, s}
          if (rec(part, 'in')) {
            acceptedParts++
          } else {
            rejectedParts++
          }
        }
      }
    }
  }

  console.log(rec({x: 1, m: 1, a: 1, s: 1}, 'in'))
  console.log(rec({x: 2000, m: 2000, a: 2000, s: 2000}, 'in'))
  console.log(rec({x: 4000, m: 4000, a: 4000, s: 4000}, 'in'))

  console.log({ranges}, {acceptedRanges})

  console.log({acceptedParts, rejectedParts})

  // answer = acceptedParts.reduce((acc, curr) => acc + curr.x + curr.m + curr.a + curr.s, 0)

  console.log('answer', answer, acceptedParts)
  console.timeEnd('duration')
})

