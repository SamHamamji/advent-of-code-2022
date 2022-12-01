import * as fs from 'fs';

function main() {
    const data = fs.readFileSync(
        "./src/day1/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );
    const inventory = data.split("\n\n").map((array) => array.trim().split("\n").map((element) => parseInt(element)));

    let max = -Infinity;
    let sum: number;
    inventory.forEach(elf => {
        sum = 0;
        elf.forEach(food => {
            sum += food;
        });
        max = (max >= sum) ? max : sum;
    });

    console.log(`The max of the calories held by an elf is: ${max}`);
}

main();