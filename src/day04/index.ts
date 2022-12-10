import * as fs from 'fs';

interface ElfRange {
    start: number;
    end: number;
}

interface ElfPair {
    first: ElfRange;
    second: ElfRange;
}

function main() {
    const data = fs.readFileSync(
        "./src/day4/input.txt",
        { encoding: 'ascii', flag: 'r' }
    ).split("\n").slice(0, -1).map(
        line => line.split(",").map(
            assignment => assignment.split("-").map(str => parseInt(str))
        ).map(assignment => (
            { start: assignment[0], end: assignment[1] } as ElfRange
        ))
    ).map(elves => (
        { first: elves[0], second: elves[1] } as ElfPair
    ));

    console.log("Part 1");
    let sum = 0;
    data.forEach(pair => {
        if (contained(pair)) {
            sum++;
        }
    })
    console.log(sum);

    console.log("Part 2");
    let sum2 = 0;
    data.forEach(pair => {
        if (overlap(pair)) {
            sum2++;
        }
    })
    console.log(sum2);
}

function contained(pair: ElfPair) {
    return (pair.first.start <= pair.second.start && pair.first.end >= pair.second.end) ||
        (pair.first.start >= pair.second.start && pair.first.end <= pair.second.end);
}

function overlap(pair: ElfPair) {
    if (pair.first.start <= pair.second.start) {
        // first starts
        return pair.first.end >= pair.second.start
    } else {
        // second starts
        return pair.second.end >= pair.first.start
    }
}

main();