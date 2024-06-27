async function run () {

  console.log("Hello World");

  const path = "./input.txt";
  const file = Bun.file(path);
  
  const text = await file.text();

  let tally = 0
  let max = 0

  for (const line of text.split("\n")) {
    if (line) {
      tally += parseInt(line);
      continue;
    }
    max = Math.max(max, tally);
    tally = 0;
  }
  console.log(`Part 1: ${max}`);

  const n = 3 // find top 3 elves carrying the most, and add up their tally

  const elves = Array(n).fill(0);
  tally = 0;

  for (const line of text.split("\n")) {
    if (line) {
      tally += parseInt(line);
      continue;
    }
    elves.sort((a, b) => a - b);
    if (tally > elves[0]) {
      elves[0] = tally;
    }
    tally = 0
  }
  console.log(`Part 2: ${elves.reduce((a, b) => a + b)}`);
}

run();
