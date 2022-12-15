import * as fs from 'fs';
import { Ground } from './Ground';
import { Sensor } from './Sensor';
import { Row } from './Row';


function main() {
    const data = fs.readFileSync(
        "./src/day15/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );
    const sensors = data.trim().split("\n").map(line => new Sensor(line));

    console.log("Part 1:");
    const row = new Row(2_000_000);
    row.scan(sensors);
    console.log(row.countSafePositions());

    console.log("Part 2:");
    console.warn("My implementation only works for small inputs. If you try " +
        "running it on the regular input, the heap limit will be crossed. " +
        "It works on the advent of code example:\n");
    const data2 = fs.readFileSync(
        "./src/day15/example.txt",
        { encoding: 'ascii', flag: 'r' }
    );
    const sensors2 = data2.trim().split("\n").map(line => new Sensor(line));
    const ground = new Ground(sensors2, {
        min: { x: 0, y: 0 },
        max: { x: 20, y: 20 }
    });
    ground.scan();
    ground.show();
    console.log(`Tuning frequency = ${ground.tuningFrequency()}`);
}

main();