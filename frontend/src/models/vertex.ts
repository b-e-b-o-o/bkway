import { getNearbyStops, getNeighbors } from "../services/api.service";
import { Coordinate } from "./coordinate";
import { DirectedWeightedEdge } from "./directedWeightedEdge";
import { Time } from "./time";

import type { Graph } from "./graph";
import { Stop } from "../types/gtfs";

/** Gets added to every transfer time when walking */
const BASE_TRANSFER_TIME = Time.of(120); // 2 minutes

export abstract class Vertex {
    protected abstract graph: Graph;

    readonly stop: Stop;
    readonly id: string;
    readonly location: Coordinate;
    readonly heuristic: number = 0;
    readonly inEdges: DirectedWeightedEdge[] = [];
    #outEdges: DirectedWeightedEdge[] | undefined;
    visited: boolean = false;
    parentEdge: DirectedWeightedEdge | null = null;
    distance: Time = Time.INFINITY;

    constructor(id: string, stop: Stop) {
        this.id = id;
        this.stop = stop;
        this.location = new Coordinate(stop.stopLat!, stop.stopLon!);
    }

    private get time(): Time {
        return this.graph.time.plus(this.distance);
    }

    async getOutEdges(): Promise<DirectedWeightedEdge[]> {
        console.log('getOutEdges', this.stop.stopName, this.id);
        if (this.#outEdges === undefined) {
            this.#outEdges = [];
            await this.addNeighborEdges();
            if (!this.isWalking()) {
                await this.addWalkingEdges();
            }
        }
        return this.#outEdges;
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

    private async addWalkingEdges(): Promise<void> {
        const nearbyStops = await getNearbyStops(this.id);
        for (const stop of nearbyStops) {
            const stopLocation = new Coordinate(stop.stopLat!, stop.stopLon!);
            const vertex = this.graph.getOrAddVertex(stop.stopId, stop);
            const travelDistance = BASE_TRANSFER_TIME.plus(this.location.distanceMeters(stopLocation));
            const stopDistance = travelDistance.plus(this.distance);
            const edge = new DirectedWeightedEdge(this, vertex, travelDistance);
            vertex.inEdges.push(edge);
            if (stopDistance.before(vertex.distance)) {
                vertex.distance = stopDistance;
                vertex.parentEdge = edge;
                vertex.visited = false;
            }
            this.#outEdges!.push(edge);
        }
    }

    private async addNeighborEdges(): Promise<void> {
        const neighbors = await getNeighbors(this.id, this.time);
        for (const { stop, trip, departureTime, arrivalTime } of neighbors) {
            const distance = Time.of(arrivalTime.arrivalTime!).minus(departureTime.departureTime!);
            const vertex = this.graph.getOrAddVertex(stop.stopId, stop);
            this.#outEdges!.push(new DirectedWeightedEdge(this, vertex, distance, { trip, departureTime, arrivalTime }));
        };
    }

    private isWalking() {
        return this.inEdges.some(e => e.isWalking);
    }
}