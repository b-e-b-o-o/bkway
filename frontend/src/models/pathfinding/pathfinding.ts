import { DirectedWeightedEdge } from "../directedWeightedEdge";
import { Vertex } from "../vertex";

export abstract class Pathfinding {
    protected path: Vertex[] | null | undefined;
    readonly start: Vertex;
    readonly endId: string;
    end: Vertex | null = null;
    
    constructor(start: Vertex, endId: string) { 
        this.start = start;
        this.endId = endId;
    }

    public get isFinished(): boolean {
        return this.end !== null;
    }

    public getPath() { 
        if (!this.isFinished)
            return;
        if (this.path === undefined)
            this.buildPath();
        return this.path;
    }

    private buildPath(): void {
        if (this.end === null)
            return;
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
