import type { Path } from "../../types/mapdata";
import type { Graph } from "../graph";
import { Vertex } from "../vertex";
import { Pathfinding } from "./pathfinding";

export class BFSPathfinding extends Pathfinding {
    public queue: Vertex[] = [];
    private visited: Map<string, Vertex> = new Map();

    constructor(graph: Graph, endId: string) {
        super(graph, endId);
        this.queue.push(this.start);
    }

    public getUnfinishedPaths(): Path[] {
        const vertices = new Set<Vertex>();
        for (const v of this.queue) {
            let current: Vertex | undefined = v;
            while (current && !vertices.has(current)) {
                vertices.add(current);
                current = current.parentVertex;
            }
        }
        const paths: Path[] = [];
        for (const v of vertices) {
            const path = v.getPathToParent;
            if (path)
                paths.push(path);
        }
        return paths;
    }

    public prune() {
        this.queue = this.queue.filter(v => v.id === this.endId);
    }

    // Returns updated edges end vertices
    public async next(): Promise<Vertex[]> {
        if (this.isFinished) {
            console.log(this.getPath());
            return [];
        }

        const current = this.queue.shift()!;
        const outEdges = await current.getOutEdges();  //.filter(e => !e.visited);
        for (const e of outEdges) {
            e.visited = true;
            const v = e.target;
            if (v.id === this.endId) {
                this.end = v;
                return [current];
            }
            if (this.visited.has(v.id))
                continue;
            if (!v.visited) {
                v.visited = true;
                this.queue.push(v);
                this.visited.set(v.id, v);
            }
            const newWeight = current.distance.plus(e.weight);
            if (+v.distance > +newWeight) {
                v.distance = newWeight;
                v.parentEdge = e;
            }
        }
        return [current];
    }
}
