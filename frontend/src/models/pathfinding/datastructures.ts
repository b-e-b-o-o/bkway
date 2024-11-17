import { BinaryHeap } from "@std/data-structures";
import type { Vertex } from "../vertex";

export interface IDataStructure {
    size: number;
    push(v: Vertex): void;
    peek(): Vertex | undefined;
    pop(): Vertex | undefined;
    elements(): Iterable<Vertex>;
    clear(): void;
}

export class QueueDataStructure implements IDataStructure {
    protected readonly queue: Vertex[] = [];

    public get size() {
        return this.queue.length;
    }

    push(v: Vertex) {
        this.queue.push(v);
    }

    peek(): Vertex | undefined {
        return this.queue[0];
    }

    pop(): Vertex | undefined {
        return this.queue.shift(); // pop() would make it a stack -> DFS
    }

    elements(): Iterable<Vertex> {
        return this.queue;
    }

    clear() {
        this.queue.length = 0;
    }
}

export class HeapDataStructure implements IDataStructure {
    private readonly heap: BinaryHeap<Vertex>;

    constructor(compare: ((a: Vertex, b: Vertex) => number)) {
        this.heap = new BinaryHeap<Vertex>(compare);
    }

    public get size() {
        return this.heap.length;
    }

    push(v: Vertex) {
        this.heap.push(v);
    }

    peek(): Vertex | undefined {
        return this.heap.peek();
    }

    pop(): Vertex | undefined {
        return this.heap.pop();
    }

    elements(): Iterable<Vertex> {
        return BinaryHeap.from(this.heap).drain();
    }

    clear() {
        this.heap.clear();
    }
}
