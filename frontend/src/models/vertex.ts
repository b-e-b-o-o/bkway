import { Coordinate } from "./coordinate";
import { DirectedWeightedEdge } from "./directedWeightedEdge";

export class Vertex {
    id: string;
    location: Coordinate;
    visited: boolean = false;
    heuristic: number = 0;
    distance: number = Number.POSITIVE_INFINITY;
    parentEdge: DirectedWeightedEdge | null = null;
    inEdges: DirectedWeightedEdge[] = [];
    outEdges: DirectedWeightedEdge[] = [];

    constructor(id: string, location: Coordinate) {
        this.id = id;
        this.location = location;
    }

    get neighbors(): Vertex[] {
        return this.outEdges.map(e => e.target);
    }

    get children(): Vertex[] {
        return this.neighbors.filter(v => v.parentEdge?.source == this);
    }

    get childrenEdges(): DirectedWeightedEdge[] {
        return this.outEdges.filter(e => e.target.parentEdge == e);
    }
}
