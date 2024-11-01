import type { Stop } from "src/types/Stop";
import { Coordinate } from "./coordinate";
import { DirectedWeightedEdge } from "./directedWeightedEdge";
import { Time } from "./time";

export class Vertex {
    readonly id: string;
    readonly location: Coordinate;
    readonly time: Time;
    readonly heuristic: number = 0;
    readonly inEdges: DirectedWeightedEdge[] = [];
    readonly outEdges: DirectedWeightedEdge[] = [];
    visited: boolean = false;
    parentEdge: DirectedWeightedEdge | null = null;
    distance: Time = Time.INFINITY;

    constructor(id: string, location: Coordinate, time: Time) {
        this.id = id;
        this.time = time;
        this.location = location;
    }

    public static fromStop(stop: Stop, time: Time): Vertex {
        return new Vertex(stop.stopId, new Coordinate(stop.stopLon, stop.stopLat), time);
    }

    get neighbors(): Vertex[] {
        return this.outEdges.map(e => e.target);
    }

    get children(): Vertex[] {
        return this.neighbors.filter(v => v.parentEdge?.source === this);
    }

    get childrenEdges(): DirectedWeightedEdge[] {
        return this.outEdges.filter(e => e.target.parentEdge === e);
    }

    public getPathToRoot(): Vertex[] {
        const path: Vertex[] = [this];
        let current: Vertex = this;
        while (current.parentEdge !== null) {
            current = current.parentEdge.source;
            path.push(current);
        }
        return path;
    }
}
