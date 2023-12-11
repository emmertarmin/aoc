function draw(table, property = 'type') {
    // console.log('\033[2J')
    console.log('')
    console.log(table.map(i => i.map(j => j[property]).join('')).join('\n'))
    console.log('')
}

function expand(table) {
    let eRows = []
    let eCols = []

    // expand vertically
    for (let i = table.length - 1; i >=0; i--) {
        if (table[i].reduce((acc, curr) => acc && curr.value === '.', true)) {
            eRows.push(i)
        }
    }

    // expand horizontally
    for (let i = table[0].length - 1; i >= 0; i--) {
        if (table.reduce((acc, curr) => acc && curr[i].value === '.', true)) {
            eCols.push(i)
        }
    }

    return [eRows, eCols]
}

module.exports = {
  draw,
  expand
}

