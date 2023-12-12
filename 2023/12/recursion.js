let checked = []

function rec (surplus, arr) {
    if (surplus === 0) {
        ch = arr.join('')
        if (checked.includes(ch)) return 0
        checked.push(ch)
        console.log(arr)
        return 1
    }
    let counter = 0
    for (let i = 0; i < arr.length; i++) {
        const newArr = [...arr]
        newArr[i] = newArr[i] + 1
        counter += rec(surplus - 1, newArr)
    }
    return counter
}

console.time('duration')

const answer = rec(4, [0,0,0])

const f = (n) => Array.from(Array(n)).reduce((acc, curr, i) => acc*(i+1), 1)

const n = 4
for (let k = 0; k < 4; k++) {
    console.log(f(n) / (f(k) * f(n-k)))
}

console.log('answer', answer)
console.timeEnd('duration')