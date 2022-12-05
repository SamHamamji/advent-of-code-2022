import * as fs from 'fs';

class Stack {
    list: string[];
    constructor(list: string[] = []) {
        this.list = list;
    }
    push(item: string) {
        this.list.push(item);
    }
    pop() {
        return this.list.pop() as string;
    }
}


function main() {
    const [stackData, movesData] = fs.readFileSync(
        "./src/day5/input.txt",
        { encoding: 'ascii', flag: 'r' }
    ).split("\n\n").map(element => element.split("\n"));

    const maxHeight = stackData.length - 1;
    console.log(maxHeight);

    const stackNum = stackData[maxHeight].split("   ").length;
    // For Part 1
    const stacks = new Array<Stack>(stackNum);
    // For Part 2
    const stacks2 = new Array<Stack>(stackNum);

    // Generate stacks and stacks2
    for (let index = 0; index < stackNum; index++) {
        stacks[index] = new Stack();
        stacks2[index] = new Stack();
        for (let height = maxHeight - 1; height >= 0; height--) {
            const item = stackData[height][1 + 4 * index];
            if (item != " ") {
                stacks[index].push(item);
                stacks2[index].push(item);
            }
        }
    }

    // Generate moves
    const moves = movesData.slice(0, -1).map(line =>
        line.match(
            /move (?<count>\d*) from (?<source>\d*) to (?<destination>\d*)/
        )?.groups as { count?: number, source?: number, destination?: number }
    );

    console.log("Initial stacks:");
    showStacks(stacks);

    // Simulate moves
    moves.forEach(move => {
        moveItemsReverse(stacks, move)
        moveItemsOrdered(stacks2, move)
    });

    console.log("Part 1:");
    showStacks(stacks);
    console.log("Stack tops:");
    showStackTops(stacks);

    console.log("Part 2:");
    showStacks(stacks2);
    console.log("Stack tops:");
    showStackTops(stacks2);

}

function moveItemsReverse(stacks: Stack[], params: { count?: number, destination?: number, source?: number }) {
    const sourceStack = stacks[params.source! as number - 1];
    const destinationStack = stacks[params.destination! as number - 1];
    for (let i = 0; i < params.count!; i++) {
        const obj = sourceStack.pop();
        destinationStack.push(obj);
    }
}

function moveItemsOrdered(stacks: Stack[], params: { count?: number, destination?: number, source?: number }) {
    const sourceStack = stacks[params.source! as number - 1];
    const destinationStack = stacks[params.destination! as number - 1];
    destinationStack.list = destinationStack.list.concat(
        sourceStack.list.splice(-params.count!)
    );
}

function showStacks(stacks: Stack[]) {
    const maxHeight = stacks.reduce((a, b) =>
        (a.list.length >= b.list.length) ? a : b
    ).list.length;

    for (let height = maxHeight - 1; height >= 0; height--) {
        console.log(
            stacks.map(stack =>
                (height < stack.list.length) ? `[${stack.list[height]}] ` : "    "
            ).join("")
        );
    }

    let str = " ";
    for (let stackNum = 1; stackNum <= stacks.length; stackNum++) {
        str = str.concat(`${stackNum}   `);
    }
    console.log(str);
}

function showStackTops(stacks: Stack[]) {
    console.log(
        stacks.map(stack =>
            `[${stack.list[stack.list.length - 1]}]`
        ).join(" ")
    );
}

main();