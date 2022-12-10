import * as fs from 'fs';

class CPU {
    register: number = 1;
    clock: number = 0;
    instructions: string[];
    savedClocks: Map<number, number | null>;

    constructor(instructions: string[], clocksToSave: number[]) {
        this.instructions = instructions;
        this.savedClocks = new Map<number, number | null>(clocksToSave.map(i => [i, null]));
    }

    run() {
        let running: string;
        let clocksLeft: number;
        this.instructions.forEach(instruction => {
            running = instruction;
            if (running === "noop")
                clocksLeft = 1;
            else
                clocksLeft = 2;

            while (clocksLeft !== 0) {
                clocksLeft--;
                this.clock++;
                this.checkForSaving();
            }
            this.executeInstruction(instruction);
        });
    }

    private checkForSaving() {
        if (this.savedClocks.has(this.clock)) {
            this.savedClocks.set(this.clock, this.getSignalStrength());
        }
    }

    private executeInstruction(instruction: string) {
        if (instruction === "noop")
            return;
        else
            this.register += parseInt(instruction.split(" ")[1]);
    }

    private getSignalStrength() {
        return this.clock * this.register;
    }
}

function main() {
    const data = fs.readFileSync(
        "./src/day10/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );

    const instructions = data.trim().split("\n");
    const clocksToSave = Array.from({ length: 6 }, (_, i) => 20 + 40 * i);

    const cpu = new CPU(instructions, clocksToSave);

    cpu.run();

    let signalStrengthSum = 0;
    cpu.savedClocks.forEach((value) => {
        signalStrengthSum += (value as number);
    });

    console.log(cpu.savedClocks);

    console.log(signalStrengthSum);
}


main();