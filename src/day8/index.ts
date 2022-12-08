import * as fs from 'fs';

enum Direction { up, right, down, left };

class Tree {
    height: number;
    constructor(height: number) {
        this.height = height;
    }
}

function checkVisibility(forest: Tree[][], x: number, y: number) {
    return [Direction.up, Direction.right, Direction.down, Direction.left].some((direction) =>
        checkVisibilityHelper(forest, x, y, direction, forest[y][x].height)
    );
}

function checkVisibilityHelper(forest: Tree[][], x: number, y: number, direction: Direction, height: number): boolean {
    const [neighborX, neighborY] = findNeighbour(x, y, direction);
    if (!insideForest(forest, neighborX, neighborY)) {
        return true;
    }
    if (forest[neighborY][neighborX].height >= height)
        return false;

    return checkVisibilityHelper(forest, neighborX, neighborY, direction, height);
}

function scenicScore(forest: Tree[][], x: number, y: number) {
    return [Direction.up, Direction.right, Direction.down, Direction.left].map(direction =>
        scenicScoreHelper(forest, x, y, direction, forest[y][x].height)
    ).reduce((a, b) => a * b);
}

function scenicScoreHelper(forest: Tree[][], x: number, y: number, direction: Direction, height: number): number {
    const [neighborX, neighborY] = findNeighbour(x, y, direction);
    if (!insideForest(forest, neighborX, neighborY))
        return 0;
    if (forest[neighborY][neighborX].height >= height)
        return 1;

    return 1 + scenicScoreHelper(forest, neighborX, neighborY, direction, height);
}

function findNeighbour(x: number, y: number, direction: Direction): [number, number] {
    switch (direction) {
        case (Direction.up):
            return [x, y - 1];
        case (Direction.right):
            return [x + 1, y];
        case (Direction.down):
            return [x, y + 1];
        case (Direction.left):
            return [x - 1, y];
    }
}

function insideForest(forest: Tree[][], x: number, y: number) {
    return ((0 <= y && y < forest.length) &&
        (0 <= x && x < forest[0].length));
}

function main() {
    const data = fs.readFileSync(
        "./src/day8/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );

    const forest = data.trim().split("\n").map(line =>
        line.split("").map(
            height => new Tree(parseInt(height))
        )
    );

    console.log("Part 1: Visibility");
    let total = 0;
    for (let y = 0; y < forest.length; y++) {
        for (let x = 0; x < forest[0].length; x++) {
            if (checkVisibility(forest, x, y))
                total++;
        }
    }
    console.log(`Total visibility: ${total}`);

    console.log("Part 1: Scenic score");
    let max = Number.NEGATIVE_INFINITY;
    for (let y = 0; y < forest.length; y++) {
        for (let x = 0; x < forest[0].length; x++) {
            const score = scenicScore(forest, x, y);
            if (score > max)
                max = score;
        }
    }
    console.log(`Maximum scenic score: ${max}`);
}


main();