import { describe, expect, test } from 'bun:test'
import { getLines, readFileLineByLine } from '@/io'

const day = '07'

describe(`day ${day}`, async () => {
	const lines = await getLines(`${import.meta.dir}/input.txt`)

	const files = new Map<string, number>([
		['root/', 0]
	])

	let currentPath: string[] = []

	function interpret(line: string) {
		const regCommand = /^\$ (?<op>\w+) ?(?<arg>.*)$/
		const regDir = /^dir (?<name>\w+)$/
		const regFile = /^(?<size>[0-9]+) (?<name>[a-zA-Z\.]+)$/

		if (regCommand.test(line)) {
			const { op, arg } = regCommand.exec(line).groups
			if (op === 'cd') {
				switch (arg) {
					case '..':
						currentPath.pop()
						break
					case '/':
						currentPath = ['root']
						break
					default:
						currentPath.push(arg)
						break
				}
			}
		}

		if (regDir.test(line)) {
			const { name } = regDir.exec(line).groups
			const path = [...currentPath, name].join('/') + '/'
			files.set(path, 0)
		}

		if (regFile.test(line)) {
			const { size, name } = regFile.exec(line).groups
			const path = [...currentPath, name].join('/')
			// files.set(currentPath.join('/'), (files.get(currentPath.join('/')) || 0) + parseInt(size))
			files.set(path, parseInt(size))
		}

	}

	for (const line of lines) {
		interpret(line)
	}

	function getSizes (path: string) {
		const isDir = path.endsWith('/')
		if (!isDir) {
			return files.get(path) || 0
		}
		if (isDir) {
			const children = Array.from(files.keys()).filter(key => key.startsWith(path) && key !== path)
			const size = children.reduce((acc, curr) => acc + (getSizes(curr) || 0), 0)
			files.set(path, size)
		}
	}

	getSizes('root/')

	// console.log(files)

	// test.only('dir a', async () => {
	// 	expect(files.get('root/a/')).toBe(94853);
	// })

	// test.only('dir root', async () => {
	// 	expect(files.get('root/')).toBe(48381165);
	// })

	function dirsUnder(size: number) {
		const dirs = Array.from(files.keys()).filter(key => files.get(key) <= size && key.endsWith('/'))
		return dirs
	}

	test('answer 1', async () => {
		expect(dirsUnder(100000).reduce((acc, curr) => acc + files.get(curr), 0)).toBe(1581595);
	})

	const total = 70000000

	const should = 30000000

	const unused = total - files.get('root/')

	// console.log('unused', unused, Math.round(unused / total * 100) + '%')

	let candidate = 'root/'

	Array.from(files.keys()).filter(key => key.endsWith('/')).forEach(key => {
		const dirSize = files.get(key)
		if (dirSize + unused >= should && dirSize < files.get(candidate)) {
			candidate = key
		}
	})

	// console.log('candidate', candidate, files.get(candidate))

	test('answer 2', async () => {
	    expect(files.get(candidate)).toBe(1544176);
	})
})
