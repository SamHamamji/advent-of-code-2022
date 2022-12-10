import { Directory, File } from "./Storage";

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

export { Command, ChangeDirectory, List };
