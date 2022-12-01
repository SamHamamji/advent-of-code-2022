import * as fs from 'fs';

const podiumLength = 3;

function main() {
    const data = fs.readFileSync(
        "./src/day1/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );
    const inventory = data.split("\n\n").map((array) => array.trim().split("\n").map((element) => parseInt(element)));

    const elves = inventory.map(elf => {
        let sum = 0;
        elf.forEach(food => {
            sum += food;
        });
        return sum;
    });

    elves.sort();


    console.log(`Calorie podium:`);
    let sum = 0;
    for (let i = elves.length - podiumLength; i < elves.length; i++) {
        console.log(elves[i]);
        sum += elves[i];
    }
    console.log(`Total: ${sum}`);
}

main();