import * as fs from 'fs';

function main() {
    const markerLengths = [4, 14];
    const signal = fs.readFileSync(
        "./src/day6/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );

    console.log("Part 1:");
    console.log(findFirstMarker(signal, markerLengths[0]));

    console.log("Part 2;");
    console.log(findFirstMarker(signal, markerLengths[1]));
}

function findFirstMarker(signal: string, markerLength: number) {
    for (let i = 0; i < signal.length - markerLength; i++) {
        if (isMarker(signal, i, markerLength)) {
            return (i + markerLength)
        }
    }
    throw new Error("No marker found in signal.");

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