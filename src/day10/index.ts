import * as fs from 'fs';

class CPU {
    register: number = 1;
    cycle: number = 1;
    instructions: string[];
    savedCycles: Map<number, number | null>;
    CRT: string;
    static readonly CRTWidth: number = 40;
    static readonly CRTHeight: number = 6;

    constructor(instructions: string[], cyclesToSave: number[]) {
        this.instructions = instructions;
        this.savedCycles = new Map<number, number | null>(cyclesToSave.map(i => [i, null]));
        this.CRT = "";
    }

    run() {
        let running: string;
        let cyclesLeft: number;
        this.instructions.forEach(instruction => {
            running = instruction;
            if (running === "noop")
                cyclesLeft = 1;
            else
                cyclesLeft = 2;

            while (cyclesLeft !== 0) {
                this.checkForSaving();
                this.CRT = this.CRT.concat(
                    (Math.abs((this.cycle - 1) % CPU.CRTWidth - this.register) <= 1) ? "#" : "."
                );
                cyclesLeft--;
                this.cycle++;
            }
            this.executeInstruction(instruction);
        });
    }

    showCRT() {
        for (let i = 0; i < CPU.CRTHeight; i++) {
            console.log(this.CRT.slice(i * CPU.CRTWidth, (i + 1) * CPU.CRTWidth));
        }
    }

    private checkForSaving() {
        if (this.savedCycles.has(this.cycle)) {
            this.savedCycles.set(this.cycle, this.register);
        }
    }

    private executeInstruction(instruction: string) {
        if (instruction === "noop")
            return;
        else
            this.register += parseInt(instruction.split(" ")[1]);
    }

    private getSignalStrength() {
        return this.cycle * this.register;
    }
}

function main() {
    const data = fs.readFileSync(
        "./src/day10/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );
    const instructions = data.trim().split("\n");
    const cyclesToSave = Array.from({ length: 6 }, (_, i) => 20 + 40 * i);
    const cpu = new CPU(instructions, cyclesToSave);

    cpu.run();

    let signalStrengthSum = 0;
    cpu.savedCycles.forEach((value, cycle) => {
        signalStrengthSum += (value as number) * cycle;
    });

    console.log("Part 1:");
    console.log(signalStrengthSum);

    console.log("Part 2:");
    cpu.showCRT();
}


main();