import * as fs from 'fs';

import { Directory, Storage, File } from "./Storage";
import { Command, ChangeDirectory, List } from "./Command";

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

function findTotalDirSize(storage: Storage, upperBound: number) {
    if (storage instanceof File) {
        return 0;
    }
    let total = 0;
    (storage as Directory).children.forEach(child => {
        total += findTotalDirSize(child, upperBound);
    });
    if (storage.getSize() <= upperBound)
        total += storage.getSize();
    return total;
}

function findSmallestDir(storage: Directory, lowerBound: number) {
    let min = storage.size;
    let other: number;
    (storage as Directory).children.forEach(child => {
        if (child instanceof Directory) {
            other = findSmallestDir(child, lowerBound);
            if (other >= lowerBound && other < min) {
                min = other;
            }
        }
    });
    return min;
}


function main() {
    const data = fs.readFileSync(
        "./src/day7/input.txt",
        { encoding: 'ascii', flag: 'r' }
    );
    const commands = data.slice("$ ".length, -"\n".length).split("\n$ ").map(
        text => parseCommand(text)
    );

    console.log("Part 1:");
    const root = new Directory("/", null);
    let currentDir = root;
    commands.slice(1).forEach(command => {
        currentDir = command.execute(currentDir);
    });
    root.computeSize();
    console.log(findTotalDirSize(root, 100000));

    console.log("Part 2:");
    const totalDiskSpace = 70000000;
    const neededSpace = 30000000;
    const missingSpace = neededSpace + root.getSize() - totalDiskSpace;
    console.log(findSmallestDir(root, missingSpace));
}


main();