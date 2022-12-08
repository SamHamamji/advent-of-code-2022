import * as fs from 'fs';

const firstDay = 1;
const lastDay = 25;

const args = process.argv.slice(2);
const day = parseInt(args[0]);

if (Number.isNaN(day)) {
    const message = `Input a day between ${firstDay} and ${lastDay} inclusive`;
    throw new Error(message);
}

if (!(day >= firstDay && day <= lastDay)) {
    const message = `${day} is not a valid day`;
    throw new Error(message);
}

const indexFile = `./src/day${day}/index.ts`;
const inputFile = `./src/day${day}/input.txt`;
if (!fs.existsSync(indexFile)) {
    const message = `Day ${day} is not posted yet`;
    throw new Error(message);
}

if (!fs.existsSync(inputFile)) {
    const message = `input.txt is missing for day ${day}, ` +
        `you can download it from https://adventofcode.com/2022/day/${day}/input`;
    throw new Error(message);
}

import(`./day${day}/index.ts`);
