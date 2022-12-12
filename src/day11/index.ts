import * as fs from 'fs';
import { Monkey, Item } from './types';

function executeTurn(monkeys: Monkey[], monkeyIndex: number, part1: boolean) {
    const currentMonkey = monkeys[monkeyIndex];
    const intemNumber = currentMonkey.items.length;
    let currentItem: Item;
    for (let i = 0; i < intemNumber; i++) {
        currentItem = currentMonkey.items[0];
        currentMonkey.operation(currentItem);
        if (part1)
            currentItem.worryLevel = Math.floor(currentItem.worryLevel / 3);
        currentMonkey.throwItem(monkeys);
        currentMonkey.inspectedItems++;
    };
}

function executeRound(monkeys: Monkey[], part1: boolean) {
    monkeys.forEach((_, index) => {
        executeTurn(monkeys, index, part1);
    });
}

function getMonkeyBusiness(monkeys: Monkey[]): number {
    let first: Monkey;
    let second: Monkey;

    monkeys.forEach((monkey) => {
        if (!first || monkey.inspectedItems > first.inspectedItems) {
            second = first;
            first = monkey;
        } else if (!second || monkey.inspectedItems > second.inspectedItems) {
            second = monkey;
        }
    });

    return first!.inspectedItems * second!.inspectedItems;
}

function executeRounds(data: string, rounds: number, part1: boolean) {
    const monkeys: Monkey[] = data.split("\n\n").map((description, _) => {
        return new Monkey(description, part1)
    });

    for (let i = 0; i < rounds; i++) {
        executeRound(monkeys, part1);
    }

    monkeys.forEach((monkey) => {
        console.log(`Monkey ${monkey.id} inspected items ${monkey.inspectedItems} times.`);
    });
    console.log(`Monkey business: ${getMonkeyBusiness(monkeys)}`);
    console.log();
}

function main() {
    const data = fs.readFileSync(
        "./src/day11/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );

    const divisors = data.matchAll(/divisible by (?<divisor>\d+)\n/g);
    let next = divisors.next();
    while (next.done !== true) {
        Item.divisors.push(parseInt(next.value.groups!.divisor));
        next = divisors.next();
    }

    console.log("Part 1:");
    executeRounds(data, 20, true);

    console.log("Part 2:");
    executeRounds(data, 10_000, false);
}

main();