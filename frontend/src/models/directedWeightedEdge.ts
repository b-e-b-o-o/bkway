import { Coordinate } from "./coordinate";
import { Time } from "./time";
import { Vertex } from "./vertex";

export class DirectedWeightedEdge {
    source: Vertex;
    target: Vertex;
    weight: Time;
    isWalking: boolean;
    path: Coordinate[] = [];
    visited: boolean = false;

    constructor(
        source: Vertex,
        target: Vertex,
        weight: Time,
        isWalking: boolean,
        path: Coordinate[]
    ) {
        this.source = source;
        this.target = target;
        this.weight = weight;
        this.isWalking = isWalking;
        this.path = path;
    }
}
