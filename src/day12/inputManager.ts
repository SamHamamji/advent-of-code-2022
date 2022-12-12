import { Location, Position } from './types';

const elevationByLetter = new Map<string, number>();
const positionByLetter = new Map<string, number>();
const first_lowercase = "a".charCodeAt(0);

for (let index = 0; index < 26; index++) {
    const letter = String.fromCharCode(index + first_lowercase);
    elevationByLetter.set(letter, index);
    positionByLetter.set(letter, Position.middle);
}

elevationByLetter.set("S", 0);
positionByLetter.set("S", Position.start);
elevationByLetter.set("E", 25);
positionByLetter.set("E", Position.end);

function parseLetter(letter: string, x: number, y: number): Location {
    const elevation = elevationByLetter.get(letter);
    const position = positionByLetter.get(letter);
    if (elevation === undefined || position === undefined) {
        const message = `Location ${letter} not recognized`;
        throw new Error(message);
    }

    return {
        x: x,
        y: y,
        elevation: elevation,
        position: position,
        shortestDistance: (position === Position.start) ? 0 : undefined,
    };
}

function parseData(data: string) {
    return data.trim().split("\n").map((line, y) =>
        line.split("").map((letter, x) => parseLetter(letter, x, y))
    );
}

export { parseData };