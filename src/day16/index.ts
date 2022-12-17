import * as fs from 'fs';
import { Valve, Valves } from './Valve';


function main() {
    const data = fs.readFileSync(
        "./src/day16/example.txt",
        { encoding: 'ascii', flag: 'r' }
    );

    const startingValve = "AA";
    const time = 3;
    const valves = new Valves(data);
    const maxPressure = valves.findMaxPressure(startingValve, time);
    valves.maxPressureMatrix.forEach(m =>
        console.log(m)
    );
    // console.log(valves.maxPressureMatrix);
    console.log(maxPressure);
}

main();