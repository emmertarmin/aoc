export type Grid = Array<Array<number | string | null | undefined>>;

export function getSubgrids(grid: Grid, filter: Grid) {
    if (grid.length < filter.length || grid[0].length < filter[0].length) {
        throw new Error('Cannot determine subgrid. Filter is bigger than grid')
    }

    let subgrids = []

    for (let x = 0; x < grid.length - filter.length + 1; x++) {
		for (let y = 0; y < grid[0].length - filter.length + 1; y++) {
			const subgrid = filter.map((row, i) => filter.map((_, j) => grid[x + i][y + j]))
            subgrids.push(subgrid)
        }
    }

    return subgrids
}

export function applyFilter(grid: Grid, filter: Grid) {
    if (grid.length !== filter.length || grid[0].length !== filter[0].length) {
        throw new Error('Cannot apply filter. Filter and grid have different dimensions')
    }

    let result: any[] = []
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (filter[i][j]) result.push(grid[i][j])
        }
    }
    return result
}