import type { Path } from "../../types/mapdata";
import type { Time } from "../time";
import type { Vertex } from "../vertex";
import { Graph } from "../graph";
import { Stop } from "../../types/gtfs";

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

    // Returns updated vertices
    public abstract next(): Promise<Vertex[]>;
}
