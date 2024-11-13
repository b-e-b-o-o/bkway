import type { Path } from "../../types/mapdata";
import type { Time } from "../time";
import type { Vertex } from "../vertex";
import { Graph } from "../graph";
import { Stop } from "../../types/gtfs";
import { DirectedWeightedEdge } from "../directedWeightedEdge";

export abstract class Pathfinding {
    #path: Path[] | null | undefined;
    readonly graph: Graph;
    readonly start: Vertex;
    #end: Vertex;
    
    constructor(start: Stop, end: Stop, time: Time) {
        this.graph = new Graph(time);
        this.start = this.graph.getOrAddVertex(start);
        this.#end = this.graph.getOrAddVertex(end);
        console.log('pathfinding from %s to %s', this.start.id, this.end.id);
    }

    public get end() {
        return this.#end;
    }

    protected set end(v: Vertex) {
        if (this.#end.id !== v.id)
            throw new Error('Cannot set end to a different vertex');
        this.#end = v;
    }

    public get isFinished(): boolean {
        // This also checks for edge case where end === start
        return this.end.parentVertex !== undefined;
    }

    public abstract getIncompletePaths(): Path[];

    public getCompletePath() { 
        if (!this.isFinished)
            return;
        if (this.#path === undefined)
            this.#path = this.end.getPathToRoot();
        return this.#path;
    }

    public getCompletePathVertices() {
        if (!this.isFinished)
            return;
        const vertices: Vertex[] = [];
        let currentVertex: Vertex | undefined = this.end;
        // Doesn't include root (on purpose!)
        do {
            vertices.push(currentVertex);
            currentVertex = currentVertex.parentVertex;
        } while (currentVertex?.parentVertex);
        vertices.reverse();
        return vertices;
    }

    // protected async discoverWalkingEdges(source: Vertex): DirectedWeightedEdge[] {
    //     for await (const e of source.getWalkingEdges()) {
    //         e.visited = true;
    //         const v = e.target;
    //         if (v.visited)
    //             continue;
    //         v.visited = true;
    //         v.distance = source.distance.plus(e.weight);
    //         v.parentEdge = e;
    //         this.graph.addEdge(v, e);
    //         if (v.id === this.end.id) {
    //             this.end = v;
    //         }
    //     }
    // }

    // Returns updated vertices
    public abstract next(): Promise<Vertex[]>;
}
