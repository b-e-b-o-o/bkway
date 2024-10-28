import { DirectedWeightedEdge } from "../directedWeightedEdge";
import { Vertex } from "../vertex";
import { Pathfinding } from "./pathfinding";

export class BFSPathfinding extends Pathfinding {
    private queue: Vertex[] = [];

    constructor(start: Vertex, end: Vertex) {
        super(start, end);
        this.queue.push(start);
    }

    public next(): (DirectedWeightedEdge | Vertex)[] {
        if (this.queue.length === 0)
            this.finished = true;
        if (this.finished)
            return [];
        
        const current = this.queue.shift()!;
        this.finished = current === this.end;
        if (current.distance === Number.POSITIVE_INFINITY)
        if (this.finished)
            return [current];
        const edges = current.outEdges;
        for (const edge of edges) {
            if (!edge.visited) {
                edge.visited = true;
                edge.target.parentEdge = edge;
                edge.target.distance = current.distance + edge.weight;
                this.queue.push(edge.target);
            }
        }
        return [current, ...this.next()];
    }
}