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
    knots: Point[];
    tailHistory: Set<string>;

    constructor(knotNum: number) {
        this.knots = Array.from({ length: knotNum },
            (_) => ({ x: 0, y: 0 } as Point)
        );
        this.tailHistory = new Set<string>();
        this.addTailToHistory();
    };

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
            this.knots[0].y++;
        else if (direction == "R")
            this.knots[0].x++;
        else if (direction == "D")
            this.knots[0].y--;
        else if (direction == "L")
            this.knots[0].x--;
        else {
            const msg = `Direction ${direction} not recognized`;
            throw new Error(msg);
        }

        for (let i = 0; i < this.knots.length - 1; i++) {
            const moverKnot = this.knots[i];
            const movingKnot = this.knots[i + 1];
            if (!areTouching(moverKnot, movingKnot)) {
                if (movingKnot.x != moverKnot.x)
                    if (movingKnot.x < moverKnot.x)
                        movingKnot.x++;
                    else
                        movingKnot.x--;

                if (movingKnot.y != moverKnot.y)
                    if (movingKnot.y < moverKnot.y)
                        movingKnot.y++;
                    else
                        movingKnot.y--;
            }

        }
    }

    private addTailToHistory() {
        const tail = this.knots.at(-1) as Point;
        this.tailHistory.add(`${tail.x},${tail.y}`);
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

    console.log("Phase 1:");
    const rope1 = new Rope(2);
    rope1.executeMoves(moves);
    console.log(rope1.tailHistory.size);

    console.log("Phase 2:");
    const rope2 = new Rope(10);
    rope2.executeMoves(moves);
    console.log(rope2.tailHistory.size);
}


main();