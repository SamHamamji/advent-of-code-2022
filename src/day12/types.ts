enum Position { start, middle, end }

interface Location {
    x: number,
    y: number,
    elevation: number,
    position: Position,
    shortestDistance?: number,
}

export { Position, Location };