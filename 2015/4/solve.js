const input = ['abcdef', 'pqrstuv', 'ckczppom'][2]

const crypto = require('crypto')

for (let i = 0; i < 10000000; i++) {
  const hash = crypto.createHash('md5').update(`${input}${i}`).digest('hex')
  if (hash.startsWith('00000')) {
      console.log(hash)
      console.log(i)
      break
    }
    if (i%100000 === 0) console.log(i, hash)
}



for (let i = 0; i < 10000000; i++) {
  const hash = crypto.createHash('md5').update(`${input}${i}`).digest('hex')
  if (hash.startsWith('000000')) {
      console.log(hash)
      console.log(i)
      break
    }
    if (i%100000 === 0) console.log(i, hash)
}
