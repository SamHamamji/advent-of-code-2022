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

const directoryName = "day" + day.toString().padStart(Math.log10(lastDay) + 1, "0");

const directoryPath = `./src/${directoryName}`;
if (!fs.existsSync(directoryPath)) {
    const message = `Day ${day} is not posted yet`;
    throw new Error(message);
}

const inputPath = `./src/${directoryName}/input.txt`;
if (!fs.existsSync(inputPath)) {
    const message = `input.txt is missing for day ${day}, ` +
        `you can download it from https://adventofcode.com/2022/day/${day}/input`;
    throw new Error(message);
}

const indexFile = `./${directoryName}/index`;
import(indexFile);
