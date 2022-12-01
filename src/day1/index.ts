import * as fs from 'fs';

function main() {
    const data = fs.readFileSync("./src/day1/input.txt", 'ascii');
    const inventory = data.split("\n\n").map((array) => array.trim().split("\n"));
}

main();