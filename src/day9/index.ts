import * as fs from 'fs';

interface Point {
    x: number;
    y: number;
}

interface Move {
    direction: string;
    steps: number;
}

class Rope {
    head: Point;
    tail: Point;
    tailHistory: Set<string>;

    constructor(head: Point = { x: 0, y: 0 }, tail: Point = { x: 0, y: 0 }) {
        this.head = head;
        this.tail = tail;
        this.tailHistory = new Set<string>();
        this.addTailToHistory();
    }

    executeMoves(moves: Move[]) {
        moves.forEach(move =>
            this.executeMove(move)
        );
    }

    executeMove(move: Move) {
        for (let i = 0; i < move.steps; i++) {
            this.executeSingleStep(move.direction);
            this.addTailToHistory();
        }
    }

    private executeSingleStep(direction: string) {
        if (direction == "U")
            this.head.y++;
        else if (direction == "R")
            this.head.x++;
        else if (direction == "D")
            this.head.y--;
        else if (direction == "L")
            this.head.x--;
        else {
            const msg = `Direction ${direction} not recognized`;
            throw new Error(msg);
        }

        if (!areTouching(this.head, this.tail)) {
            if (this.tail.x != this.head.x)
                if (this.tail.x < this.head.x)
                    this.tail.x++;
                else
                    this.tail.x--;

            if (this.tail.y != this.head.y)
                if (this.tail.y < this.head.y)
                    this.tail.y++;
                else
                    this.tail.y--;
        }
    }

    private addTailToHistory() {
        this.tailHistory.add(`${this.tail.x},${this.tail.y}`);
    }
}

function areTouching(a: Point, b: Point) {
    return Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1;
}

function main() {
    const data = fs.readFileSync(
        "./src/day9/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );

    const moves = data.trim().split("\n").map(line => {
        const values = line.split(" ");
        const direction = values[0];
        const steps = parseInt(values[1]);
        return { direction: direction, steps: steps } as Move;
    });

    const rope = new Rope();
    rope.executeMoves(moves);
    console.log(rope.tailHistory.size);
}


main();