import { Coordinates, Sensor } from './Sensor';

enum Square { Beacon, Safe, Unsafe };

class Ground {
    bounds: { max: Coordinates, min: Coordinates };
    rows: Square[][];
    sensors: Sensor[];
    constructor(sensors: Sensor[], bounds: { max: Coordinates, min: Coordinates }) {
        this.bounds = bounds;
        this.sensors = sensors;
        this.rows = Array.from({ length: bounds.max.y - bounds.min.y + 1 }, () =>
            Array.from({ length: bounds.max.x - bounds.min.x + 1 }, () =>
                Square.Unsafe
            )
        );
    }

    scan() {
        this.sensors.forEach(sensor => {
            const sensorToBeacon = sensor.distanceToBeacon();
            this.rows.forEach((row, y) => {
                const sensorToRow = Math.abs(sensor.location.y - (y + this.bounds.min.y));
                const start = (sensor.location.x - this.bounds.min.x) - (sensorToBeacon - sensorToRow);
                const end = (sensor.location.x - this.bounds.min.x) + (sensorToBeacon - sensorToRow);
                for (let x = start; x <= end; x++) {
                    if (row[x] === Square.Unsafe)
                        row[x] = Square.Safe;
                }
            });
            const beaconX = sensor.beaconLocation.x - this.bounds.min.x;
            const beaconY = sensor.beaconLocation.y - this.bounds.min.y;
            if (beaconY >= 0 && beaconY <= this.bounds.max.y &&
                beaconX >= 0 && beaconX <= this.bounds.max.x)
                this.rows[beaconY][beaconX] = Square.Beacon;
        });
    }

    show() {
        const map: ("." | "B" | "#" | "S")[][] = this.rows.map(row =>
            row.map(square => {
                switch (square) {
                    case Square.Unsafe:
                        return ".";
                    case Square.Beacon:
                        return "B";
                    case Square.Safe:
                        return "#";
                    default:
                        throw new Error("Unrecognized square");
                }
            })
        );

        this.sensors.forEach(sensor => {
            map[sensor.location.y - this.bounds.min.y][sensor.location.x - this.bounds.min.x] = "S";
        });

        console.log(map.map(line =>
            line.join("")
        ).join("\n"));
    }

    tuningFrequency() {
        for (let y = 0; y < this.rows.length; y++) {
            for (let x = 0; x < this.rows[y].length; x++) {
                if (this.rows[y][x] === Square.Unsafe)
                    return 4000000 * x + y;
            }
        }
    }
}

export { Ground };