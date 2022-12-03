import * as fs from 'fs';

const itemPriority = new Map<string, number>([]);
const first_lowercase = "a".charCodeAt(0);
const first_uppercase = "A".charCodeAt(0);
for (let index = 0; index < 26; index++) {
    itemPriority.set(String.fromCharCode(index + first_lowercase), index + 1);
    itemPriority.set(String.fromCharCode(index + first_uppercase), index + 27);
}

function main() {
    const data = fs.readFileSync(
        "./src/day3/input.txt",
        { encoding: 'ascii', flag: 'r' }
    ).split("\n").slice(0, -1).map(line =>
        [line.slice(0, line.length / 2), line.slice(line.length / 2)]
    );

    let sum = 0;
    data.forEach(compartment => sum += checkDiff(compartment[0], compartment[1]))
    console.log(sum);
};

function checkDiff(first: string, second: string) {
    const set = new Set<string>();
    for (let index = 0; index < first.length; index++)
        set.add(first[index]);

    for (let index = 0; index < second.length; index++)
        if (set.has(second[index]))
            return itemPriority.get(second[index]) as number;

    return 0;
}


main();