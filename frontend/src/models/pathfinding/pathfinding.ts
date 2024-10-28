import { DirectedWeightedEdge } from "../directedWeightedEdge";
import { Vertex } from "../vertex";

export abstract class Pathfinding {
    protected finished: boolean = false;
    protected path: Vertex[] | null | undefined;
    readonly start: Vertex;
    readonly end: Vertex;
    
    constructor(start: Vertex, end: Vertex) {
        this.start = start;
        this.end = end;
    }

    public get isFinished(): boolean {
        return this.finished;
    }

    public getPath() { 
        if (!this.finished)
            return;
        if (this.path === undefined)
            this.buildPath();
        return this.path;
    }

    private buildPath(): void {
        const path: Vertex[] = [];
        let current: Vertex = this.end;
        while (current.parentEdge !== null) {
            path.push(current);
            current = current.parentEdge.source;
        }
        if (current !== this.start)
            this.path = null;
        else
            this.path = path;
    }

    // Returns updated edges end vertices
    public abstract next(): (DirectedWeightedEdge | Vertex)[];
}
