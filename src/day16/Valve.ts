interface matchedValveRegExp {
    name: string,
    flowRate: string,
    tunnels: string
};

interface Scenario {
    pressure: number,
    open: Set<string>
};

class Valves {
    valves: Map<string, Valve>;
    maxPressureMatrix: Map<string, Scenario>[];


    constructor(data: string) {
        this.maxPressureMatrix = [];

        const lines = data.trim().split("\n");
        const matches = lines.map(line =>
            line.match(Valve.valveRegExp)?.groups as unknown as matchedValveRegExp
        );

        this.valves = new Map(matches.map(match =>
            [match.name!, new Valve(match)]
        ));
    }

    findMaxPressure(startingValveName: string, time: number) {
        this.maxPressureMatrix = Array.from({ length: time + 1 }, () =>
            new Map<string, Scenario>()
        );

        // Base cases
        this.valves.forEach((_, name) => {
            this.maxPressureMatrix[0].set(name, {
                pressure: 0,
                open: new Set<string>()
            });
        });

        for (let timeLeft = 1; timeLeft <= time; timeLeft++) {
            this.valves.forEach(valve => {
                let maxPressure = Number.NEGATIVE_INFINITY;
                let maxName = "";
                valve.tunnels.forEach(neighbour => {
                    const scenario = this.maxPressureMatrix[timeLeft - 1].get(neighbour)!;
                    if (maxPressure < scenario.pressure) {
                        maxPressure = scenario.pressure;
                        maxName = neighbour;
                    }
                });

                const openingScenario = this.maxPressureMatrix[timeLeft - 1].get(valve.name)!;
                const openingPressure = openingScenario.pressure + valve.flowRate * timeLeft;
                if (valve.flowRate !== 0 &&
                    !openingScenario.open.has(valve.name) &&
                    openingPressure > maxPressure) {
                    this.maxPressureMatrix[timeLeft].set(valve.name, {
                        pressure: openingPressure,
                        open: new Set(openingScenario.open).add(valve.name)
                    })
                } else {
                    const x = this.maxPressureMatrix[timeLeft - 1].get(maxName)!;
                    this.maxPressureMatrix[timeLeft].set(valve.name, {
                        pressure: maxPressure,
                        open: new Set(this.maxPressureMatrix[timeLeft - 1].get(maxName)!.open)
                    });
                }
            });
        }
        return this.maxPressureMatrix[time].get(startingValveName)!.pressure;
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
    tunnels: string[];

    constructor(match: matchedValveRegExp) {
        this.closed = true;
        this.name = match.name;
        this.flowRate = parseInt(match.flowRate);
        this.tunnels = match.tunnels.split(", ");
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