export type V3 = {
	x: number,
	y: number,
	z: number,
}

/**
 * Adds two vectors together.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The sum of the two vectors.
 */
export function add(a: V3, b: V3) {
	return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z}
}

/**
 * Subtracts two vectors.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The result of subtracting vector b from vector a.
 */
export function sub(a: V3, b: V3) {
	return {x: a.x - b.x, y: a.y - b.y, z: a.z - b.z}
}

/**
 * Checks if two vectors are adjacent.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns True if the vectors are adjacent, false otherwise.
 */
export function isAdjacent(a: V3, b: V3) {
	return ['x', 'y', 'z'].every(key => Math.abs(a[key] - b[key]) <= 1)
}

export function isNeighbor(a: V3, b: V3) {
	return ['x', 'y', 'z'].filter(key => Math.abs(a[key] - b[key]) === 1).length === 1
}

/**
 * Calculates the length of a vector.
 * @param v - The vector to calculate the length of.
 * @returns The length of the vector.
 */
export function length(v: V3) {
	return Math.sqrt(v.x**2 + v.y**2 + v.z**2)
}

/**
 * Calculates the Manhattan length of a vector.
 *
 * @param v - The vector to calculate the length of.
 * @returns The Manhattan length of the vector.
 */
export function lengthM(v: V3) {
	return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z)
}

/**
 * Calculates the distance between two vectors.
 * @param a The first vector.
 * @param b The second vector.
 * @returns The distance between the two vectors.
 */
export function dist(a: V3, b: V3) {
	return length(sub(a, b))
}

/**
 * Calculates the Manhattan distance between two vectors.
 * @param a The first vector.
 * @param b The second vector.
 * @returns The Manhattan distance between the two vectors.
 */
export function distM(a: V3, b: V3) {
	return lengthM(sub(a, b))
}

export function intersection(a: V3 | V3[], b: V3 | V3[]) {
	a = Array.isArray(a) ? a : [a]
	b = Array.isArray(b) ? b : [b]
	return a.filter(v => b.some(w => v.x === w.x && v.y === w.y && v.z === w.z))
}

export function getNeighbors(v: V3) {
	const neighbors: V3[] = []
	for (let x = -1; x <= 1; x++) {
		for (let y = -1; y <= 1; y++) {
			for (let z = -1; z <= 1; z++) {
				if ([x, y, z].map(Math.abs).filter(v => v === 1).length !== 1) continue
				neighbors.push({x: v.x + x, y: v.y + y, z: v.z + z})
			}
		}
	}
	if (neighbors.length !== 6) throw new Error('Neighbor count didn\'t match 6.')
	return neighbors
}