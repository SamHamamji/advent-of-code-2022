import * as fs from 'fs';
import { Sensor } from './Sensor';
import { Row } from './Row';


function main() {
    const data = fs.readFileSync(
        "./src/day15/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );

    const sensors = data.trim().split("\n").map(line => new Sensor(line))
    const row = new Row(2_000_000);

    row.scan(sensors);
    console.log(row.countSafePositions());

}

main();