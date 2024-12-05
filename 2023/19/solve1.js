const fs = require('fs')
const util = require('util')

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile)

function readInput() {
  return readFile('input.txt', 'utf8')
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
  console.log({parts, rules})

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

  const acceptedParts = parts.filter(part => rec(part, 'in'))

  answer = acceptedParts.reduce((acc, curr) => acc + curr.x + curr.m + curr.a + curr.s, 0)

  console.log('answer', answer)
  console.timeEnd('duration')
})

