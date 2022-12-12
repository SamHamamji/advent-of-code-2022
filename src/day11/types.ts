class Item {
    static divisors: number[] = [];
    worryLevel: number;
    worryModulos: Map<number, number>;
    constructor(worryLevel: number) {
        this.worryLevel = worryLevel;
        this.worryModulos = new Map<number, number>(Item.divisors.map(divisor =>
            [divisor, worryLevel % divisor]
        ));
    }
}

interface Test {
    divisor: number;
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

    constructor(description: string, part1: boolean) {
        const text = description.trim().concat("\n");
        const group = text.match(Monkey.monkeyRegExp)!.groups as unknown as MatchedMonkeyGroup;

        this.id = parseInt(group.id);
        this.inspectedItems = 0;
        this.items = group.items.split(", ").map(item => new Item(parseInt(item)));
        this.operation = this.parseOperation(group.operation, part1);

        const divisor = Monkey.parseCondition(group.condition);
        this.test = {
            divisor: divisor,
            condition: (item: Item) =>
                ((part1) ?
                    (item.worryLevel % divisor) :
                    (item.worryModulos.get(divisor)! % divisor)
                ) === 0,
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

    parseOperation(operation: string, part1: boolean): (item: Item) => void {
        const [operand1, operator, operand2] = operation.split(" ");
        const errorMessage = `Operator ${operator} not recognized`;

        if (part1) {
            return (item: Item) => {
                const first = ((operand1 === "old") ? item.worryLevel : Number(operand1));
                const second = ((operand2 === "old") ? item.worryLevel : Number(operand2));
                if (operator === "+") {
                    item.worryLevel = first + second;
                } else if (operator === "-") {
                    item.worryLevel = first - second;
                } else if (operator === "*") {
                    item.worryLevel = first * second;
                } else if (operator === "/") {
                    item.worryLevel = first / second;
                } else {
                    throw new Error(errorMessage);
                }
            }
        } else {
            return (item: Item) => {
                item.worryModulos.forEach((previous, divisor) => {
                    const first = ((operand1 === "old") ? previous : Number(operand1));
                    const second = ((operand2 === "old") ? previous : Number(operand2));
                    if (operator === "+")
                        item.worryModulos.set(divisor, (first + second) % divisor);
                    else if (operator === "-")
                        item.worryModulos.set(divisor, (first - second) % divisor);
                    else if (operator === "*")
                        item.worryModulos.set(divisor, (first * second) % divisor);
                    else if (operator === "/")
                        item.worryModulos.set(divisor, (first / second) % divisor);
                    else
                        throw new Error(errorMessage);
                });
            }
        }
    }

    private static parseCondition(condition: string): number {
        const divisor = /divisible by (?<divisor>\d+)/.exec(condition)!;
        if (divisor === null) {
            const message = `Condition "${condition}" not recognized`;
            throw new Error(message);
        }
        return parseInt(divisor.groups!.divisor);
    };
}

export { Item, Monkey } 