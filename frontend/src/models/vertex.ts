import { getNearbyStops, getNeighbors } from "../services/api.service";
import type { Stop } from "../types/gtfs";
import { Coordinate } from "./coordinate";
import { DirectedWeightedEdge } from "./directedWeightedEdge";
import { Time } from "./time";

export class Vertex {
    readonly id: string;
    readonly location: Coordinate;
    readonly time: Time;
    readonly heuristic: number = 0;
    readonly inEdges: DirectedWeightedEdge[] = [];
    #outEdges: DirectedWeightedEdge[] | null = null;
    visited: boolean = false;
    parentEdge: DirectedWeightedEdge | null = null;
    distance: Time = Time.INFINITY;

    constructor(id: string, location: Coordinate, time: Time) {
        this.id = id;
        this.time = time;
        this.location = location;
    }

    public static fromStop(stop: Stop, time: Time): Vertex {
        return new Vertex(stop.stopId, new Coordinate(stop.stopLat!, stop.stopLon!), time);
    }

    async getOutEdges(): Promise<DirectedWeightedEdge[]> {
        if (this.#outEdges === null) {
            this.#outEdges = [];
            if (!this.isWalking()) {
                const nearbyStops = await getNearbyStops(this.id);
                for (const stop of nearbyStops) {
                    // TODO: don't hardcode. 1m/s for walking + 2m by default
                    const distance = Time.of(this.location.distanceMeters(new Coordinate(stop.stopLat!, stop.stopLon!))).plus(2);
                    const vertex = Vertex.fromStop(stop, this.time.plus(distance));
                    this.#outEdges!.push(new DirectedWeightedEdge(this, vertex, distance, true, []));
                }
            }
            const neighbors = await getNeighbors(this.id, this.time.toString());
            for (const stop of neighbors) {
                const distance = Time.of(stop.arrivalTime.arrivalTime!).minus(stop.departureTime.departureTime!);
                const vertex = Vertex.fromStop(stop.stop, this.time.plus(distance));
                this.#outEdges!.push(new DirectedWeightedEdge(this, vertex, distance, false, []));
            };
        }
        return this.#outEdges;
    }

    // async getNeighbors(): Promise<Vertex[]> {
    //     return await this.getOutEdges.map(e => e.target);
    // }

    // get children(): Vertex[] {
    //     return this.neighbors.filter(v => v.parentEdge?.source === this);
    // }

    // get childrenEdges(): DirectedWeightedEdge[] {
    //     return this.outEdges.filter(e => e.target.parentEdge === e);
    // }

    public getPathToRoot(): Vertex[] {
        const path: Vertex[] = [this];
        let current: Vertex = this;
        while (current.parentEdge !== null) {
            current = current.parentEdge.source;
            path.push(current);
        }
        return path;
    }

    private isWalking() {
        return this.inEdges.some(e => e.isWalking);
    }
}
