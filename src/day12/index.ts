import * as fs from 'fs';
import { Location, Position } from './types';
import { parseData } from './inputManager';

function findShortestDistance(map: Location[][], source: { x: number, y: number }) {
    const queue: Location[] = [map[source.y][source.x]];
    while (queue.length !== 0) {
        const current = queue.pop()!;
        const neighbours = [
            { y: current.y + 1, x: current.x },
            { y: current.y - 1, x: current.x },
            { y: current.y, x: current.x + 1 },
            { y: current.y, x: current.x - 1 },
        ].map(coordinates => (
            0 <= coordinates.y && coordinates.y < map.length &&
            0 <= coordinates.x && coordinates.x < map[0].length
        ) ? map[coordinates.y][coordinates.x] : null
        ).filter(element => element !== null) as Location[];
        for (const neighbour of neighbours) {
            if (neighbour === undefined)
                continue;
            if (neighbour.shortestDistance === undefined &&
                isReachable(current, neighbour)) {
                queue.unshift(neighbour);
                neighbour.shortestDistance = current.shortestDistance! + 1;
            }
        }
    }
}

function isReachable(source: Location, neighbour: Location) {
    return neighbour.elevation <= 1 + source.elevation;
}

function findLocation(map: Location[][], identifier: (location: Location) => boolean) {
    for (const row of map) {
        for (const location of row) {
            if (identifier(location))
                return location;
        }
    }
    throw new Error("Location not found");

}

function main() {
    const data = fs.readFileSync(
        "./src/day12/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );

    const map: Location[][] = parseData(data);

    const start = findLocation(map, (location) =>
        location.position === Position.start
    );
    const end = findLocation(map, (location) =>
        location.position === Position.end
    );

    findShortestDistance(map, start);

    console.log(end.shortestDistance)
}

main();