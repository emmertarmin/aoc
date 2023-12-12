function rec (surplus, arr) {
    if (surplus === 0) {
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

const answer = rec(3, [0,0])

console.log('answer', answer)
console.timeEnd('duration')