interface matchedValveRegExp {
    name: string,
    flowRate: string,
    tunnels: string
};

class Valves {
    valves: Valve[];
    maxPressure: number;

    constructor(data: string) {
        this.maxPressure = Number.NEGATIVE_INFINITY;

        const lines = data.trim().split("\n");
        const matches = lines.map(line =>
            line.match(Valve.valveRegExp)?.groups as unknown as matchedValveRegExp
        )

        this.valves = matches.map(match =>
            new Valve(match)
        );

        matches.forEach((match, valveIndex) =>
            match.tunnels.split(", ").forEach(neighbourName =>
                this.valves[valveIndex].tunnels.unshift(this.valves.find(valve =>
                    valve.name === neighbourName
                )!)
            )
        );
    }

    findMaxPressure(startingValve: Valve, time: number) {
        this.findMaxPressureHelper(startingValve, 0, time);
    }

    private findMaxPressureHelper(
        currentValve: Valve,
        currentPressure: number,
        timeLeft: number
    ) {
        if (timeLeft === 0) {
            this.maxPressure = Math.max(this.maxPressure, currentPressure);
        } else {
            // Try opening and visit all neighbours
            if (currentValve.isClosed() && currentValve.flowRate !== 0) {
                currentValve.open();
                this.findMaxPressureHelper(
                    currentValve,
                    currentPressure + currentValve.flowRate * timeLeft,
                    timeLeft - 1
                );
                currentValve.close();
            }

            currentValve.tunnels.forEach(neighbour => {
                this.findMaxPressureHelper(
                    neighbour,
                    currentPressure,
                    timeLeft - 1
                );
            });
        }
    }
}

class Valve {
    static valveRegExp = new RegExp([
        /Valve (?<name>\w+) has flow rate=(?<flowRate>\d+); /.source +
        /tunnel(?:s)? lead(?:s)? to valve(?:s)? (?<tunnels>\w+(?:, \w+)*)/.source
    ].join(""));

    private closed: boolean;
    name: string;
    flowRate: number;
    tunnels: Valve[];

    constructor(match: matchedValveRegExp) {
        this.closed = true;
        this.name = match.name;
        this.flowRate = parseInt(match.flowRate);
        this.tunnels = [];
    }

    open() {
        this.closed = false;
    }

    close() {
        this.closed = true;
    }

    isClosed() {
        return this.closed;
    }
}

export { Valve, Valves };