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

    constructor(data: string) {
        const rockPaths = data.trim().split("\n").map(line =>
            line.split(" -> ").map(location =>
                location.split(",").map(value => parseInt(value))
            ).map(coordinates => {
                return { x: coordinates[0], y: coordinates[1] };
            })
        );

        const mapRange = Cave.getRange(rockPaths);
        this.map = Array.from({ length: mapRange.y[1] - mapRange.y[0] + 1 }, (_, i) =>
            Array.from({ length: mapRange.x[1] - mapRange.x[0] + 1 }, (_, j) => Element.air)
        );
        this.drawRockPaths(rockPaths, mapRange);
        this.source = { x: Cave.initialSource.x - mapRange.x[0], y: Cave.initialSource.y };
        this.map[this.source.y][this.source.x] = Element.source;
    }

    show() {
        console.log(this.map.map(line =>
            line.map(element => elementRepr.get(element) as string).join("")
        ).join("\n"));
    }

    dropSingleSand(): boolean {
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
                lowerLocationIndex.y >= this.map.length)
                return true;
            const lowerLocation = this.map[lowerLocationIndex.y][lowerLocationIndex.x];
            if (lowerLocation === undefined)
                return true;
            if (lowerLocation === Element.air)
                return this.dropSingleSandHelper(lowerLocationIndex);
        }
        this.map[location.y][location.x] = Element.sand;
        this.sandCounter++;
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
                    this.map[current.y - rockRange.y[0]][i - rockRange.x[0]] = Element.rock;
                }
            } else {
                for (let i = current.y; i !== next.y; i += (current.y < next.y) ? 1 : -1) {
                    this.map[i - rockRange.y[0]][current.x - rockRange.x[0]] = Element.rock;
                }
            }
        }
        const last = rockPath[rockPath.length - 1];
        this.map[last.y - rockRange.y[0]][last.x - rockRange.x[0]] = Element.rock;
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

    const cave = new Cave(data);

    while (!cave.dropSingleSand());

    cave.show();
    console.log(cave.sandCounter);
}


main();