import { Coordinate } from "./coordinate";
import { Time } from "./time";
import { Vertex } from "./vertex";

export class DirectedWeightedEdge {
    source: Vertex;
    target: Vertex;
    weight: Time;
    path: Coordinate[] = [];
    visited: boolean = false;

    constructor(
        source: Vertex,
        target: Vertex,
        weight: Time,
        path: Coordinate[]
    ) {
        this.source = source;
        this.target = target;
        this.weight = weight;
        this.path = path;
    }
}
