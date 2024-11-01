import { Coordinate } from "../coordinate";
import { DirectedWeightedEdge } from "../directedWeightedEdge";
import { Vertex } from "../vertex";
import { Pathfinding } from "./pathfinding";

export class BFSPathfinding extends Pathfinding {
    private queue: Vertex[] = [];

    constructor(start: Vertex, endId: string) {
        super(start, endId);
        this.queue.push(start);
    }

    public getUnfinishedPaths(): Coordinate[][] {
        const paths: Coordinate[][] = [];
        for (const v of this.queue) {
            paths.push(v.getPathToRoot().map(v => v.location));
        }
        return paths;
    }

    // Returns updated edges end vertices
    public next(): (DirectedWeightedEdge | Vertex)[] {
        if (this.isFinished)
            return [];

        const current = this.queue.shift()!;
        const outEdges = current.outEdges;  //.filter(e => !e.visited);
        for (const e of outEdges) {
            e.visited = true;
            const v = e.target;
            if (!v.visited) {
                v.visited = true;
                this.queue.push(v);
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