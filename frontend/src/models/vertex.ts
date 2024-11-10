import { getNearbyStops, getNeighbors } from "../services/api.service";
import { hexToRgb } from "../utils/util";
import { Coordinate } from "./coordinate";
import { DirectedWeightedEdge } from "./directedWeightedEdge";
import { Time } from "./time";

import type { Graph } from "./graph";
import type { Stop } from "../types/gtfs";
import type { Path } from "../types/mapdata";

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
    #parentEdge: DirectedWeightedEdge | undefined | null;
    #pathToParent: Path | undefined;
    distance: Time = Time.INFINITY;

    constructor(id: string, stop: Stop) {
        this.id = id;
        this.stop = stop;
        this.location = new Coordinate(stop.stopLat!, stop.stopLon!);
    }

    protected get time(): Time {
        return this.graph.time.plus(this.distance);
    }

    public get parentVertex(): Vertex | undefined {
        return this.parentEdge?.source;
    }

    public get parentEdge(): DirectedWeightedEdge | undefined {
        return this.#parentEdge ?? undefined;
    }

    // Since the root vertex has no parent edge, the two properties should depend on each other
    public get isRoot(): boolean {
        return this.#parentEdge === null;
    }

    public set isRoot(value: boolean) {
        if (this.parentEdge !== undefined && !value)
            throw new Error('Cannot set isRoot to true when parent edge is set');
        if (value)
            this.#parentEdge = null;
    }

    public set parentEdge(edge: DirectedWeightedEdge) {
        if (this.isRoot)
            return;
        this.#parentEdge = edge;
        this.#pathToParent = {
            name: edge.isWalking ? 'walk.' : (edge.route?.routeShortName ?? '') + ' -> ' + (edge.trip?.tripHeadsign ?? ''),
            points: edge.shape,
            color: edge.isWalking ? [255, 255, 255] as [number, number, number] : hexToRgb(edge.route?.routeColor ?? '#FF0000')!,
        };
    }

    public get pathToParent(): Path | undefined {
        return this.#pathToParent;
    }

    async getOutEdges(): Promise<DirectedWeightedEdge[]> {
        if (this.#outEdges === undefined) {
            this.#outEdges = [];
            await this.addNeighborEdges();
            if (!this.isWalking()) {
                await this.addWalkingEdges();
            }
        }
        return this.#outEdges;
    }

    public getPathToRoot(): Path[] {
        const paths: Path[] = [];
        let currentVertex: Vertex | undefined = this;
        while (currentVertex) {
            const path = currentVertex.pathToParent;
            if (path)
                paths.push(path);
            currentVertex = currentVertex.parentVertex;
        }
        return paths;
    }

    private async addWalkingEdges(): Promise<void> {
        const nearbyStops = await getNearbyStops(this.id);
        for (const stop of nearbyStops) {
            const vertex = this.graph.getOrAddVertex(stop.stopId, stop);
            const travelDistance = BASE_TRANSFER_TIME.plus(this.location.distanceMeters(vertex.location));
            const edge = new DirectedWeightedEdge(this, vertex, travelDistance, [this.location, vertex.location]);
            vertex.inEdges.push(edge);
            this.#outEdges!.push(edge);
        }
    }

    private async addNeighborEdges(): Promise<void> {
        const neighbors = await getNeighbors(this.id, this.time);
        for (const { stop, trip, departureTime, arrivalTime, shape, route } of neighbors) {
            const vertex = this.graph.getOrAddVertex(stop.stopId, stop);
            const distance = Time.of(arrivalTime.arrivalTime!).minus(this.time);
            const edge = new DirectedWeightedEdge(
                this,
                vertex,
                distance,
                shape.map(s => new Coordinate(s.shapePtLat, s.shapePtLon)),
                { trip, departureTime, arrivalTime, route }
            );
            vertex.inEdges.push(edge);
            this.#outEdges!.push(edge);
        };
    }

    private isWalking() {
        return this.inEdges.some(e => e.isWalking);
    }
}