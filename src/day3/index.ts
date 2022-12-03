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
    ).split("\n").slice(0, -1);

    console.log("Part 1:");

    let sum = 0;
    data.forEach(line => sum += checkDiff(
        line.slice(0, line.length / 2),
        line.slice(line.length / 2)
    ));
    console.log(sum);

    console.log("Part 2:");
    let sum2 = 0;
    for (let team = 0; team < data.length / 3; team++) {
        sum2 += getBadge(
            data[3 * team],
            data[3 * team + 1],
            data[3 * team + 2]
        )
    }
    console.log(sum2);
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

function getBadge(first: string, second: string, third: string) {
    const firstItems = new Set<string>(first.split(""));
    const secondItems = new Set<string>(second.split(""));
    let badge = 0;

    third.split("").forEach(item => {
        if (firstItems.has(item) && secondItems.has(item)) {
            badge = itemPriority.get(item) as number;
        }
    });
    return badge;
}

main();