import type { Graph } from "../graph";
import type { Vertex } from "../vertex";

export abstract class Pathfinding {
    protected path: Vertex[] | null | undefined;
    readonly start: Vertex;
    readonly endId: string;
    end: Vertex | null = null;
    
    constructor(graph: Graph, endId: string) { 
        if (graph.vertices.size !== 1)
            throw new Error('Graph must have exactly one vertex, the start vertex');
        this.start = graph.vertices.values().next().value!;
        console.log('pathfinding from %s to %s', this.start.id, endId);
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

    // Returns updated vertices
    public abstract next(): Promise<Vertex[]>;
}
