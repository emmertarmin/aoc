const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
	input: fs.createReadStream('input.txt')
});

let answer = 0

function diffs(sequence) {
	// stop condition
	if (sequence.reduce((acc, curr) => acc && curr === 0, true)) {
		return 0
	}
	return sequence[sequence.length - 1] + diffs(sequence.slice(1).map((v, i) => v - sequence[i]))
}

rl
	.on('line', (line) => {
		const sequence = Array.from(line.matchAll(/([\-\d]+)/g)).map(i => Number(i[1]))
		const next = diffs(sequence)
		answer += next
	})
	.on('close', () => {
		console.log('part 1', answer)
	})

