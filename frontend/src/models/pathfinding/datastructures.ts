import FastPriorityQueue from "fastpriorityqueue";
import type { Vertex } from "../vertex";

export interface IDataStructure {
    size: number;
    push(v: Vertex): void;
    peek(): Vertex | undefined;
    pop(): Vertex | undefined;
    remove(v: Vertex): boolean;
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

    remove(v: Vertex): boolean {
        const index = this.queue.indexOf(v);
        if (index > -1) {
            this.queue.splice(index, 1);
            return true;
        }
        return false;
    }

    elements(): Iterable<Vertex> {
        return this.queue;
    }

    clear() {
        this.queue.length = 0;
    }
}

export class HeapDataStructure implements IDataStructure {
    private readonly heap: FastPriorityQueue<Vertex>;

    constructor(compare: ((a: Vertex, b: Vertex) => boolean)) {
        this.heap = new FastPriorityQueue<Vertex>(compare);
    }

    public get size() {
        return this.heap.size;
    }

    push(v: Vertex) {
        this.heap.add(v);
    }

    peek(): Vertex | undefined {
        return this.heap.peek();
    }

    pop(): Vertex | undefined {
        return this.heap.poll();
    }

    remove(v: Vertex): boolean {
        return this.heap.remove(v);
    }

    elements(): Iterable<Vertex> {
        const ret: Vertex[] = []
        this.heap.forEach((e) => ret.push(e))
        return ret;
    }

    clear() {
        this.heap.heapify([]);
    }
}
