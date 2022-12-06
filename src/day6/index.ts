import * as fs from 'fs';

function main() {
    const markerLength = 4;
    const signal = fs.readFileSync(
        "./src/day6/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );

    for (let i = 0; i < signal.length - markerLength; i++) {
        if (isMarker(signal, i, markerLength)) {
            console.log(i + markerLength);
            break;
        }
    }

}

function isMarker(signal: string, index: number, markerLength: number) {
    for (let i = index; i < index + markerLength; i++) {
        for (let j = i + 1; j < index + markerLength; j++) {
            if (signal.charAt(i) === signal.charAt(j)) {
                return false
            }
        }
    }
    return true
}

main();