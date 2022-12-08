import * as fs from 'fs';

enum Direction { up, right, down, left };

class Tree {
    height: number;

    constructor(height: number) {
        this.height = height;
    }
}

function checkVisibility(forest: Tree[][], x: number, y: number) {
    if (x === 0 || x === forest[0].length || y === 0 || y === forest.length)
        return true;
    return checkVisibilityHelper(forest, x, y, Direction.up, forest[y][x].height) ||
        checkVisibilityHelper(forest, x, y, Direction.right, forest[y][x].height) ||
        checkVisibilityHelper(forest, x, y, Direction.down, forest[y][x].height) ||
        checkVisibilityHelper(forest, x, y, Direction.left, forest[y][x].height);
}

function checkVisibilityHelper(forest: Tree[][], x: number, y: number, direction: Direction, height: number): boolean {
    let neighborX = x;
    let neighborY = y;

    switch (direction) {
        case (Direction.up):
            neighborY--;
            break;
        case (Direction.right):
            neighborX++;
            break;
        case (Direction.down):
            neighborY++;
            break;
        case (Direction.left):
            neighborX--;
            break;
    }
    if ((neighborY < 0 || neighborY >= forest.length) ||
        (neighborX < 0 || neighborX >= forest[0].length)) {
        return true;
    }

    if (forest[neighborY][neighborX].height >= height)
        return false;

    return checkVisibilityHelper(forest, neighborX, neighborY, direction, height);

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

    let sum = 0;
    for (let y = 0; y < forest.length; y++) {
        for (let x = 0; x < forest[0].length; x++) {
            if (checkVisibility(forest, x, y))
                sum++;
        }
    }
    console.log(sum);
}


main();