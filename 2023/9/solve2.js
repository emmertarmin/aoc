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
	return sequence[0] - diffs(sequence.slice(1).map((v, i) => v - sequence[i]))
}

rl
	.on('line', (line) => {
		const sequence = Array.from(line.matchAll(/([\-\d]+)/g)).map(i => Number(i[1]))
		const prev = diffs(sequence)
		answer += prev
	})
	.on('close', () => {
		console.log('part 1', answer)
	})

