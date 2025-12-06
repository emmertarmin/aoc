import { describe, expect, test } from 'bun:test'
import { getLines } from '@/io'
import { add } from '@/vector'

const day = '22'

type Dir = '>' | 'v' | '<' | '^'

async function solve(lines: string[]) {
  const tiles = {}
  let instructions = []
  let pos = {x: 0, y: 0}

  let y = 0
  for (let line of lines) {
    if (/[\.#]/.test(line)) {
      const points = line.split('')
      for (let x = 0; x < points.length; x++) {
        if (points[x] === '#' || points[x] === '.') tiles[`${x},${y}`] = points[x]
      }
      if (y === 0) {
        pos = {x: points.indexOf('.'), y}
      }

      y++
    }
    if (line.includes('R')) {
      while (line.length) {
        const {i} = line.match(/(?<i>\d+|R|L)/).groups
        instructions.push(/\d+/.test(i) ? Number(i) : i)
        line = line.slice(i.length)
      }
    }
  }

  // console.log({pos, instructions})

  let minx = Infinity
  let miny = Infinity
  let maxx = -Infinity
  let maxy = -Infinity

  for (let key in tiles) {
    const [x, y] = key.split(',').map(Number)
    if (x < minx) minx = x
    if (y < miny) miny = y
    if (x > maxx) maxx = x
    if (y > maxy) maxy = y
  }

  function print(dot?: {x: number, y: number, f: string} = null) {
    let str = ''
    for (let y = miny; y <= maxy; y++) {
      let row = ''
      for (let x = minx; x <= maxx; x++) {
        if (dot && dot.x === x && dot.y === y) {
          row += dot.f
          continue
        }
        row += tiles[`${x},${y}`] || ' '
      }
      str += row + '\n'
    }
    process.stdout.moveCursor(0, - (maxy - miny + 2))
    process.stdout.write(str)

    // console.log(str)

  }

  function rotate(facing: Dir, dir: 'L' | 'R'): Dir {
    const dirs = ['^', '>', 'v', '<'] as Dir[]
    if (dir === 'L') {
      return dirs[(dirs.indexOf(facing) + 3) % 4]
    }
    if (dir === 'R') {
      return dirs[(dirs.indexOf(facing) + 1) % 4]
    }
  }

  const step = {
    '>': {x: 1, y: 0},
    'v': {x: 0, y: 1},
    '<': {x: -1, y: 0},
    '^': {x: 0, y: -1},
  }

  let facing: Dir = '>'
  // tiles[`${pos.x},${pos.y}`] = facing
  // print()

  for (let ins of instructions) {
    if (['L', 'R'].includes(ins)) {
      facing = rotate(facing, ins)
    }
    if (typeof ins === 'number') {
      while(ins > 0) {
        ins--
        // console.log('ins', ins)
        let next = add(pos, step[facing])
        if (!tiles.hasOwnProperty(`${next.x},${next.y}`)) {
          if (facing === '>') {
            next.x = minx
            while (!tiles.hasOwnProperty(`${next.x},${next.y}`)) {
              next = add(next, step[facing])
            }
          }
          if (facing === '<') {
            next.x = maxx
            while (!tiles.hasOwnProperty(`${next.x},${next.y}`)) {
              next = add(next, step[facing])
            }
          }
          if (facing === '^') {
            next.y = maxy
            while (!tiles.hasOwnProperty(`${next.x},${next.y}`)) {
              next = add(next, step[facing])
            }
          }
          if (facing === 'v') {
            next.y = miny
            while (!tiles.hasOwnProperty(`${next.x},${next.y}`)) {
              next = add(next, step[facing])
            }
          }
        }
        if (tiles[`${next.x},${next.y}`] === '#') break
        if (tiles[`${next.x},${next.y}`] === '.') pos = next
        // print({x: pos.x, y: pos.y, f: facing})
        // await new Promise(r => setTimeout(r, 1000))
      }
    }
  }

  // console.log({pos, facing})

  return 1000 * (pos.y+1) + 4 * (pos.x+1) + {'>': 0, 'v': 1, '<': 2, '^': 3}[facing]
}

describe(`day ${day}`, async () => {
	const linesTest = await getLines(`${import.meta.dir}/test1.txt`) as string[]
	const linesProd = await getLines(`${import.meta.dir}/input.txt`) as string[]

  describe('part 1 test', async () => {
    test('answer', async () => {
      const answer = await solve(linesTest)
      expect(answer).toBe(6032);
    })
	})
  describe('part 1 prod', async () => {
    test('answer', async () => {
      const answer = await solve(linesProd)
      expect(answer).toBe(95358);
    })
  })

  describe('part 2 test', async () => {
    test('answer', async () => {
      const answer = await solve(linesTest)
      expect(answer).toBe(-1);
    })
  })

  describe('part 2 prod', async () => {
    test('answer', async () => {
      const answer = await solve(linesProd)
      expect(answer).toBe(-1);
    })
  })

})
