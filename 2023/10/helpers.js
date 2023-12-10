function get(table, x, y) {
  if (x < 0 || y < 0 || x >= table.length || y >= table[0].length) {
    return '#'
  }
  return table[x][y]
}

function set(table, property, x, y, val) {
  if (x < 0 || y < 0 || x >= table.length || y >= table[0].length) {
    return
  }
  table[x][y][property] = val
}

async function draw(table, property = 'type') {
  // console.log('\033[2J')
  console.log(table.map(i => i.map(j => j[property]).join('')).join('\n'))
  await wait()
}

function getAllNeighbours(table, x, y) {
  const neighbours = []
  const directions = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
  ]
  for (const direction of directions) {
    const nb = { x: x + direction.x, y: y + direction.y }
    neighbours.push(nb)
  }
  return neighbours
}

function getConnectingNeighbours(table, x, y) {
  const neighbours = []
  const directions = [
    { x: -1, y: 0, src: ['S', 'L', '|', 'J'], dest: ['F', '|', '7']},
    { x: 1, y: 0, src: ['S', 'F', '|', '7'], dest: ['L', '|', 'J']},
    { x: 0, y: -1, src: ['S', '-', 'J', '7'], dest: ['L', '-', 'F']},
    { x: 0, y: 1, src: ['S', 'L', '-', 'F'], dest: ['-', 'J', '7']},
  ]
  const point = get(table, x, y)
  for (const direction of directions) {
    const neighbor = get(table, x + direction.x, y + direction.y)
    if (direction.src.includes(point.type) && direction.dest.includes(neighbor.type)) {
      const nb = { x: x + direction.x, y: y + direction.y }
      neighbours.push(nb)
    }
  }
  return neighbours
}

async function wait(ms = 50) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
  get,
  set,
  draw,
  wait,
  getConnectingNeighbours,
  getAllNeighbours
}

