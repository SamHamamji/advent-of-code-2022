import * as fs from 'fs';

abstract class Storage {
    name: string;
    parent: Directory | null;
    size: number;
    constructor(name: string, size: number, parent: Directory | null) {
        this.name = name;
        this.size = size;
        this.parent = parent;
    }
    abstract getSize(): number;
}

class File extends Storage {
    constructor(name: string, size: number, parent: Directory | null) {
        super(name, size, parent);
    }
    getSize(): number {
        return this.size;
    }
}

class Directory extends Storage {
    children: Storage[];
    constructor(name: string, parent: Directory | null, children = new Array<Storage>()) {
        super(name, -1, parent);
        this.children = children;
    }
    getSize(): number {
        if (this.size === -1)
            this.computeSize();
        return this.size;
    }
    computeSize(): void {
        this.size = 0;
        this.children.forEach(child => this.size += child.getSize());
    }
}

abstract class Command {
    static commandName: string;
    abstract execute(currentDir: Directory): Directory;
}

class ChangeDirectory extends Command {
    static commandName = "cd ";
    destinationName: string;
    constructor(text: string) {
        super();
        this.destinationName = text.slice(ChangeDirectory.commandName.length).trim();
    }
    execute(currentDir: Directory): Directory {
        if (this.destinationName === "..")
            return currentDir.parent as Directory;

        for (const child of currentDir.children) {
            if (child.name === this.destinationName) {
                return child as Directory;
            }
        }
        const errorMsg = `${this.destinationName} not found from ${currentDir.name}`
        throw new Error(errorMsg);

    }
}

class List extends Command {
    static commandName = "ls";
    output: string[];

    constructor(text: string) {
        super();
        this.output = text.split("\n").slice(1);
    }

    execute(currentDir: Directory) {
        this.output.forEach(line => {
            const storageInfo = line.split(" ");
            currentDir.children = currentDir.children.concat(
                (storageInfo[0] === "dir") ?
                    new Directory(storageInfo[1], currentDir) :
                    new File(storageInfo[1], parseInt(storageInfo[0]), currentDir)
            );
        });
        return currentDir;
    }
}

function parseCommand(text: string) {
    let command: Command;
    if (text.slice(0, ChangeDirectory.commandName.length) === ChangeDirectory.commandName) {
        command = new ChangeDirectory(text);
    } else if (text.slice(0, List.commandName.length) === List.commandName) {
        command = new List(text);
    } else {
        const errorMsg = `Command name not found in ${text}`;
        throw new Error(errorMsg);
    }
    return command;
}

function main() {
    const data = fs.readFileSync(
        "./src/day7/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );

    const commands = data.slice("$ ".length, -"\n".length).split("\n$ ").map(
        text => parseCommand(text)
    );

    const root = new Directory("/", null);
    let currentDir = root;
    commands.slice(1).forEach(command => {
        currentDir = command.execute(currentDir);
    });

    root.computeSize();

    console.log(findTotalDirSize(root, 100000));
}

function findTotalDirSize(root: Storage, upperBound: number) {
    if (root instanceof File) {
        return 0;
    }
    let total = 0;
    (root as Directory).children.forEach(child => {
        total += findTotalDirSize(child, upperBound);
    });
    if (root.getSize() <= upperBound)
        total += root.getSize();
    return total;
}

main();