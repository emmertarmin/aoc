export type V = {
	x: number,
	y: number,
}

/**
 * Adds two vectors together.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The sum of the two vectors.
 */
export function add(a: V, b: V) {
	return {x: a.x + b.x, y: a.y + b.y}
}

/**
 * Subtracts two vectors.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The result of subtracting vector b from vector a.
 */
export function sub(a: V, b: V) {
	return {x: a.x - b.x, y: a.y - b.y}
}

/**
 * Checks if two vectors are adjacent.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns True if the vectors are adjacent, false otherwise.
 */
export function isAdjacent(a: V, b: V) {
	return ['x', 'y'].every(key => Math.abs(a[key] - b[key]) <= 1)
}

/**
 * Calculates the length of a vector.
 * @param v - The vector to calculate the length of.
 * @returns The length of the vector.
 */
export function length(v: V) {
	return Math.sqrt(v.x**2 + v.y**2)
}

/**
 * Calculates the Manhattan length of a vector.
 *
 * @param v - The vector to calculate the length of.
 * @returns The Manhattan length of the vector.
 */
export function lengthM(v: V) {
	return Math.abs(v.x) + Math.abs(v.y)
}

/**
 * Calculates the distance between two vectors.
 * @param a The first vector.
 * @param b The second vector.
 * @returns The distance between the two vectors.
 */
export function dist(a: V, b: V) {
	return length(sub(a, b))
}

/**
 * Calculates the Manhattan distance between two vectors.
 * @param a The first vector.
 * @param b The second vector.
 * @returns The Manhattan distance between the two vectors.
 */
export function distM(a: V, b: V) {
	return lengthM(sub(a, b))
}

export function intersection(a: V | V[], b: V | V[]) {
	a = Array.isArray(a) ? a : [a]
	b = Array.isArray(b) ? b : [b]
	return a.filter(v => b.some(w => v.x === w.x && v.y === w.y))
}