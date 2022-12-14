import * as fs from 'fs';

enum Element { air, rock, sand, source }

const elementRepr = new Map([
    [Element.air, "."], [Element.rock, "#"],
    [Element.sand, "o"], [Element.source, "+"]
]);

class Cave {
    map: Element[][];
    source: { x: number, y: number };
    static initialSource = { x: 500, y: 0 };
    sandCounter = 0;
    part1: boolean;

    constructor(data: string, part1: boolean) {
        this.part1 = part1;
        const rockPaths = data.trim().split("\n").map(line =>
            line.split(" -> ").map(location =>
                location.split(",").map(value => parseInt(value))
            ).map(coordinates => {
                return { x: coordinates[0], y: coordinates[1] };
            })
        );

        const mapRange = Cave.getRange(rockPaths);
        this.map = Array.from({ length: mapRange.y[1] - mapRange.y[0] + (this.part1 ? 1 : 3) }, (_, i) =>
            Array.from({ length: mapRange.x[1] + (part1 ? - mapRange.x[0] + 1 : mapRange.x[1]) }, (_, j) =>
                Element.air)
        );
        this.drawRockPaths(rockPaths, mapRange);
        if (!this.part1) {
            this.map[this.map.length - 1].forEach((_, index) =>
                this.map[this.map.length - 1][index] = Element.rock
            );
        }
        this.source = {
            x: Cave.initialSource.x - (this.part1 ? mapRange.x[0] : 0),
            y: Cave.initialSource.y
        };
        this.map[this.source.y][this.source.x] = Element.source;
    }

    show() {
        console.log(this.map.map(line =>
            line.map(element => elementRepr.get(element) as string).join("")
        ).join("\n"));
    }

    dropSand() {
        while (!this.dropSingleSand());
    }

    private dropSingleSand(): boolean {
        return this.dropSingleSandHelper(this.source);
    }

    private dropSingleSandHelper(location: { x: number, y: number }): boolean {
        const lowerLocationIndexes = [
            { y: location.y + 1, x: location.x },
            { y: location.y + 1, x: location.x - 1 },
            { y: location.y + 1, x: location.x + 1 }
        ];

        for (const lowerLocationIndex of lowerLocationIndexes) {
            if (lowerLocationIndex.y < 0 ||
                lowerLocationIndex.y >= this.map.length ||
                lowerLocationIndex.x < 0 ||
                lowerLocationIndex.x >= this.map.length)
                if (this.part1)
                    return true;
            const lowerLocation = this.map[lowerLocationIndex.y][lowerLocationIndex.x];
            if (lowerLocation === undefined) {
                this.show();
                const errorMessage = `Location ${lowerLocationIndex.x}, ${lowerLocationIndex.y} is undefined`;
                throw new Error(errorMessage);
            }
            if (lowerLocation === Element.air)
                return this.dropSingleSandHelper(lowerLocationIndex);
        }
        this.sandCounter++;
        if (this.map[location.y][location.x] === Element.source) {
            this.map[location.y][location.x] = Element.sand;
            return true;
        }
        this.map[location.y][location.x] = Element.sand;
        return false;
    }

    private drawRockPaths(
        rockPaths: { x: number, y: number }[][],
        rockRange: { x: [number, number], y: [number, number] }
    ) {
        rockPaths.forEach(rockPath => {
            this.drawRockPath(rockPath, rockRange);
        });
    }

    private drawRockPath(rockPath: { x: number, y: number }[], rockRange: {
        x: [number, number], y: [number, number]
    }) {
        for (let index = 0; index < rockPath.length - 1; index++) {
            const current = rockPath[index];
            const next = rockPath[index + 1];
            if (current.x !== next.x) {
                for (let i = current.x; i !== next.x; i += (current.x < next.x) ? 1 : -1) {
                    this.map[current.y][i - (this.part1 ? rockRange.x[0] : 0)] = Element.rock;
                }
            } else {
                for (let i = current.y; i !== next.y; i += (current.y < next.y) ? 1 : -1) {
                    this.map[i][current.x - (this.part1 ? rockRange.x[0] : 0)] = Element.rock;
                }
            }
        }
        const last = rockPath[rockPath.length - 1];
        this.map[last.y][last.x - (this.part1 ? rockRange.x[0] : 0)] = Element.rock;
    }

    static getRange(rockPaths: { x: number, y: number }[][]) {
        const initialRange = {
            x: [Cave.initialSource.x, Cave.initialSource.x],
            y: [Cave.initialSource.y, Cave.initialSource.y]
        };
        return rockPaths.reduce((previousPathRange, path) => {
            const currentPathRange = path.reduce(
                (previousRockRange, rock) => {
                    return {
                        x: [
                            Math.min(previousRockRange.x[0], rock.x),
                            Math.max(previousRockRange.x[1], rock.x)
                        ], y: [
                            Math.min(previousRockRange.y[0], rock.y),
                            Math.max(previousRockRange.y[1], rock.y)
                        ]
                    }
                }, initialRange);
            return {
                x: [
                    Math.min(previousPathRange.x[0], currentPathRange.x[0]),
                    Math.max(previousPathRange.x[1], currentPathRange.x[1])
                ], y: [
                    Math.min(previousPathRange.y[0], currentPathRange.y[0]),
                    Math.max(previousPathRange.y[1], currentPathRange.y[1])
                ]
            }
        }, initialRange) as { x: [number, number], y: [number, number] };
    }
}

function main() {
    const data = fs.readFileSync(
        "./src/day14/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );

    console.log("Part 1");
    const cave1 = new Cave(data, true);
    cave1.dropSand();
    cave1.show();
    console.log(cave1.sandCounter, "\n");

    console.log("Part 2");
    const cave2 = new Cave(data, false);
    cave2.dropSand();
    console.log(cave2.sandCounter);
}


main();