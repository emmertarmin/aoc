import { describe, expect, test } from 'bun:test'
import { getSubgrids, applyFilter } from './grid'

describe('getSubgrids', () => {
    test('Determine all subgrids.', () => {
        const grid = [
            ['A', 'B', 'C'],
            ['D', 'E', 'F'],
            ['G', 'H', 'I']
        ]

        const filter = [
            [1, 1],
            [1, 1]
        ]

        const result = getSubgrids(grid, filter)
        expect(result).toEqual([
            [
                ['A', 'B'],
                ['D', 'E']
            ],
            [
                ['B', 'C'],
                ['E', 'F']
            ],
            [
                ['D', 'E'],
                ['G', 'H']
            ],
            [
                ['E', 'F'],
                ['H', 'I']
            ]
        ])
    })

    test('Throw when subgrid should be bigger then grid', () => {
        const grid = [
            ['A', 'B'],
            ['C', 'D']
        ]

        const filter = [
            [1, 1, 1]
        ]

        expect(() => getSubgrids(grid, filter)).toThrow()
    })
})

describe('applyFilter', () => {
    test('Apply filter to grid (1).', () => {
        const grid = [
            ['A', 'B', 'C'],
            ['D', 'E', 'F'],
            ['G', 'H', 'I']
        ]

        const filter = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]

        const result = applyFilter(grid, filter)
        expect(result).toEqual(['A', 'E', 'I'])
    })
    test('Apply filter to grid (2).', () => {
        const grid = [
            ['A', 'B', 'C'],
            ['D', 'E', 'F'],
            ['G', 'H', 'I']
        ]

        const filter = [
            [0, 0, 1],
            [0, 1, 0],
            [1, 0, 0]
        ]

        const result = applyFilter(grid, filter)
        expect(result).toEqual(['C', 'E', 'G'])
    })
    test('Mismatching dimensions.', () => {
        const grid = [
            ['A', 'B', 'C'],
            ['D', 'E', 'F'],
            ['G', 'H', 'I']
        ]

        const filter = [
            [1, 0],
            [0, 1],
            [0, 0]
        ]

        expect(() => applyFilter(grid, filter)).toThrow()
    })
})