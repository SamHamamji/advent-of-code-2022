import * as fs from 'fs';

class Item {
    worryLevel: number;
    constructor(worryLevel: number) {
        this.worryLevel = worryLevel;
    }
}

interface Test {
    condition: (item: Item) => boolean;
    outcomes: Map<boolean, number>;
}

interface MatchedMonkeyGroup {
    id: string;
    items: string;
    operation: string;
    condition: string;
    trueID: string;
    falseID: string;
}

class Monkey {
    id: number;
    items: Item[];
    inspectedItems: number;
    operation: (item: Item) => void;
    test: Test;
    private static monkeyRegExp = new RegExp([
        /Monkey (?<id>\d+):\n/,
        /  Starting items: (?<items>\d+(?:, \d+)*)\n/,
        /  Operation: new = (?<operation>.+)\n/,
        /  Test: (?<condition>.+)\n/,
        /    If true: throw to monkey (?<trueID>\d+)\n/,
        /    If false: throw to monkey (?<falseID>\d+)\n/,
    ].map(r => r.source).join(''));

    constructor(description: string) {
        const text = description.trim().concat("\n");
        const group = text.match(Monkey.monkeyRegExp)!.groups as unknown as MatchedMonkeyGroup;

        this.id = parseInt(group.id);
        this.inspectedItems = 0;
        this.items = group.items.split(", ").map(item => new Item(parseInt(item)));
        this.operation = Monkey.parseOperation(group.operation);
        this.test = {
            condition: Monkey.parseCondition(group.condition),
            outcomes: new Map<boolean, number>(
                [
                    [true, parseInt(group.trueID)],
                    [false, parseInt(group.falseID)]
                ]
            )
        } as Test;
    }

    throwItem(monkeys: Monkey[]) {
        const thrownItem = this.items.shift() as Item;
        const condition = this.test.condition(thrownItem);
        const destination = this.test.outcomes.get(condition) as number;
        monkeys[destination].items.push(thrownItem as Item);
    }

    private static parseOperation(operation: string): (item: Item) => void {
        const [operand1, operator, operand2] = operation.split(" ");
        const errorMessage = `Operator ${operator} not recognized`;

        switch (operator) {
            case ("+"):
                return (item: Item) =>
                    item.worryLevel = ((operand1 === "old") ? item.worryLevel : Number(operand1)) +
                    ((operand2 === "old") ? item.worryLevel : Number(operand2));
            case ("-"):
                return (item: Item) =>
                    item.worryLevel = ((operand1 === "old") ? item.worryLevel : Number(operand1)) -
                    ((operand2 === "old") ? item.worryLevel : Number(operand2));
            case ("*"):
                return (item: Item) =>
                    item.worryLevel = ((operand1 === "old") ? item.worryLevel : Number(operand1)) *
                    ((operand2 === "old") ? item.worryLevel : Number(operand2));
            case ("/"):
                return (item: Item) =>
                    item.worryLevel = ((operand1 === "old") ? item.worryLevel : Number(operand1)) /
                    ((operand2 === "old") ? item.worryLevel : Number(operand2));
        }
        throw new Error(errorMessage);
    }

    private static parseCondition(condition: string): (item: Item) => boolean {
        const divisor = /divisible by (?<divisor>\d+)/.exec(condition)!;
        if (divisor === null) {
            const message = `Condition "${condition}" not recognized`;
            throw new Error(message);
        }
        return (item: Item) => (item.worryLevel % parseInt(divisor.groups!.divisor)) === 0;
    };
}

function executeTurn(monkeys: Monkey[], monkeyIndex: number) {
    const currentMonkey = monkeys[monkeyIndex];
    const intemNumber = currentMonkey.items.length;
    let currentItem: Item;
    for (let i = 0; i < intemNumber; i++) {
        currentItem = currentMonkey.items[0];
        currentMonkey.operation(currentItem);
        currentItem.worryLevel = Math.floor(currentItem.worryLevel / 3);
        currentMonkey.throwItem(monkeys);
        currentMonkey.inspectedItems++;
    };
}

function executeRound(monkeys: Monkey[]) {
    monkeys.forEach((_, index) => {
        executeTurn(monkeys, index);
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

function main() {
    const data = fs.readFileSync(
        "./src/day11/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );

    const monkeys: Monkey[] = data.split("\n\n").map((description, _) => {
        return new Monkey(description)
    });


    for (let i = 0; i < 20; i++) {
        executeRound(monkeys);
    }

    monkeys.forEach((monkey) => {
        console.log(`Monkey ${monkey.id} inspected items ${monkey.inspectedItems} times.`);
    });
    console.log();
    console.log(`Monkey business: ${getMonkeyBusiness(monkeys)}`);
}

main();