import { Sensor } from './Sensor';

class Row {
    y: number;
    known = new Map<number, string>();
    safePositions = 0;
    constructor(y: number) {
        this.y = y;
    }

    scan(sensors: Sensor[]) {
        sensors.forEach(sensor => {
            const limit = sensor.distanceToBeacon() - Math.abs(sensor.location.y - this.y);
            for (let i = 0; i <= limit; i++) {
                for (const x of [sensor.location.x + i, sensor.location.x - i])
                    if (this.known.get(x) !== "B")
                        this.known.set(x, "#");
            }
            if (sensor.beaconLocation.y === this.y) {
                this.known.set(sensor.beaconLocation.x, "B");
            }
        });
    }

    show() {
        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;
        this.known.forEach((_, y) => {
            min = Math.min(min, y);
            max = Math.max(max, y);
        });
        const str = Array.from({ length: max - min }, (_, index) => {
            switch (this.known.get(index + min + 1)) {
                case undefined:
                    return ".";
                case "B":
                    return "B";
                case "#":
                    return "#";
                default:
                    return ".";
            }
        }).join("");
        console.log(str);
    }

    countSafePositions() {
        this.known.forEach(element =>
            this.safePositions += (element === "#") ? 1 : 0
        )
        return this.safePositions;
    }
}

export { Row };
