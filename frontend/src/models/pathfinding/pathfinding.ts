import type { Path } from "../../types/mapdata";
import type { Graph } from "../graph";
import type { Vertex } from "../vertex";

export abstract class Pathfinding {
    #path: Path[] | null | undefined;
    readonly start: Vertex;
    readonly endId: string;
    public end: Vertex | null = null;
    
    constructor(graph: Graph, endId: string) { 
        if (graph.vertices.size !== 1)
            throw new Error('Starting graph must have exactly one vertex, the start vertex');
        this.start = graph.vertices.values().next().value!;
        console.log('pathfinding from %s to %s', this.start.id, endId);
        this.endId = endId;
    }

    public get isFinished(): boolean {
        return this.end !== null;
    }

    public abstract getIncompletePaths(): Path[];

    public getCompletePath() { 
        if (this.end === null)
            return;
        if (this.#path === undefined)
            this.#path = this.end.getPathToRoot();
        return this.#path;
    }

    // Returns updated vertices
    public abstract next(): Promise<Vertex[]>;
}
