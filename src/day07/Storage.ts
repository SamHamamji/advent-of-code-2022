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

export { Storage, File, Directory };