interface Coordinates {
    x: number,
    y: number
}

class Sensor {
    private static sensorRegExp = new RegExp([
        /Sensor at x=(?<x>\d+), y=(?<y>\d+): /,
        /closest beacon is at x=(?<beaconX>-?\d+), y=(?<beaconY>-?\d+)/,
    ].map(r => r.source).join(''));

    location: Coordinates;
    beaconLocation: Coordinates;
    constructor(line: string) {
        const matched = line.match(Sensor.sensorRegExp)?.groups as unknown as {
            x: string, y: string, beaconX: string, beaconY: string
        };
        this.location = {
            x: parseInt(matched.x),
            y: parseInt(matched.y)
        };
        this.beaconLocation = {
            x: parseInt(matched.beaconX),
            y: parseInt(matched.beaconY)
        };
    }

    distanceToBeacon() {
        return Math.abs(this.location.x - this.beaconLocation.x) +
            Math.abs(this.location.y - this.beaconLocation.y)
    }
}

export { Sensor };
