export async function readFileLineByLine(filePath, onLineRead, onFinish = () => console.log("done")) {
	const foo = Bun.file(filePath);

	const stream = await foo.stream();
	const decoder = new TextDecoder();

	let remainingData = "";

	for await (const chunk of stream) {
		const str = decoder.decode(chunk);

		remainingData += str; // Append the chunk to the remaining data

		// Split the remaining data by newline character
		let lines = remainingData.split(/\r?\n/);
		// Loop through each line, except the last one
		while (lines.length > 0) {
			// Remove the first line from the array and pass it to the callback
			onLineRead(lines.shift());
		}
		// Update the remaining data with the last incomplete line
		remainingData = lines[0];
	}

	return onFinish();
}

export async function getLines(path: string) {
	const lines: string[] = []

	const onLineRead = (line: string) => {
		line = line.trim();
		if (line.length > 0) lines.push(line);
	}

	const onFinish = () => {
		// console.log(lines);
	}

	await readFileLineByLine(path, onLineRead, onFinish);

	return lines
}