import * as fs from 'fs';

enum Shape {
    Rock,
    Paper,
    Scissors
}

const ShapeScore = new Map<Shape, number>([
    [Shape.Rock, 1],
    [Shape.Paper, 2],
    [Shape.Scissors, 3]
]);

const OutcomeScore = {
    Win: 6,
    Tie: 3,
    Loss: 0,
};

const ShapeBeats = new Map<Shape, Shape>([
    [Shape.Rock, Shape.Scissors],
    [Shape.Paper, Shape.Rock],
    [Shape.Scissors, Shape.Paper]
]);

const LetterShape = new Map<string, Shape>([
    ["A", Shape.Rock],
    ["B", Shape.Paper],
    ["C", Shape.Scissors],
    ["X", Shape.Rock],
    ["Y", Shape.Paper],
    ["Z", Shape.Scissors],
]);

class Round {
    public readonly first: Shape;
    public readonly second: Shape;

    constructor(first: Shape, second: Shape, ...argv: number[]) {
        this.first = first;
        this.second = second;
    }

    public Scores(): [number, number] {
        const firstScore = ShapeScore.get(this.first) as number;
        const secondScore = ShapeScore.get(this.second) as number;

        const scores: [number, number] = [
            firstScore,
            secondScore
        ];

        if (ShapeBeats.get(this.first) == this.second) {
            scores[0] += OutcomeScore.Win;
            scores[1] += OutcomeScore.Loss;
        } else if (ShapeBeats.get(this.second) == this.first) {
            scores[0] += OutcomeScore.Loss;
            scores[1] += OutcomeScore.Win;
        } else {
            scores[0] += OutcomeScore.Tie;
            scores[1] += OutcomeScore.Tie;
        }
        return scores;
    }
}

function main() {
    const data = fs.readFileSync(
        "./src/day2/input.txt",
        { encoding: 'ascii', flag: 'r' }
    ).split("\n").slice(0, -1);

    console.log("Part 1:");
    const rounds = data.map(line => {
        return new Round(...line.split(" ").map(letter =>
            LetterShape.get(letter)
        ) as [Shape, Shape])
    });

    let total = 0;
    rounds.forEach(round => {
        total += round.Scores()[1];
    });
    console.log(`total score: ${total}`);


    console.log("Part 2:");
    const rounds2 = data.map(line => {
        let score = 0;
        const other = LetterShape.get(line[0]) as Shape;
        switch (line[2]) {
            case "X":
                score += OutcomeScore.Loss;
                const self = ShapeBeats.get(other) as Shape;
                score += ShapeScore.get(self) as number;
                break;
            case "Y":
                score += OutcomeScore.Tie;
                score += ShapeScore.get(other) as number;
                break;
            case "Z":
                score += OutcomeScore.Win;
                ShapeBeats.forEach((first, second) => {
                    if (first == other) {
                        score += ShapeScore.get(second) as number;
                    }
                });
                break;
            default:
                throw new Error(`Input line "${line}" not valid`);
        }
        return score;
    });

    let total2 = 0;
    rounds2.forEach(round => {
        total2 += round;
    });
    console.log(`total score: ${total2}`);
};


main();