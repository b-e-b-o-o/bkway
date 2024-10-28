import { Coordinate } from "./coordinate";
import { Vertex } from "./vertex";

export class DirectedWeightedEdge {
    source: Vertex;
    target: Vertex;
    weight: number = 0;
    path: Coordinate[] = [];
    visited: boolean = false;

    constructor(
        source: Vertex,
        target: Vertex,
        weight: number,
        path: Coordinate[]
    ) {
        this.source = source;
        this.target = target;
        this.weight = weight;
        this.path = path;
    }
}
