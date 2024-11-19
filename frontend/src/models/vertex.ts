import { getNearbyStops, getNeighbors } from "../services/api.service";
import { hexToRgb } from "../utils/util";
import { Coordinate } from "./coordinate";
import { DirectedWeightedEdge } from "./directedWeightedEdge";
import { Time } from "./time";

import type { Graph } from "./graph";
import type { Stop } from "../types/gtfs";
import type { Path } from "../types/mapdata";
import { PathfindingConfig } from "./pathfinding/pathfindingConfig";

/** Gets added to every transfer time when walking */
const BASE_TRANSFER_TIME = Time.of(120); // 2 minutes

export abstract class Vertex {
    public static nextId = 0;
    protected abstract graph: Graph;

    readonly stop: Stop;
    readonly id: number;
    readonly location: Coordinate;
    readonly inEdges: DirectedWeightedEdge[] = [];
    #stepsFromRoot: number = Number.POSITIVE_INFINITY;
    #walkingEdges: DirectedWeightedEdge[] | undefined;
    #transitEdges: DirectedWeightedEdge[] | undefined;
    visited: boolean = false;
    #parentEdge: DirectedWeightedEdge | undefined | null;
    #pathToParent: Path | undefined;
    distance: Time = Time.INFINITY;
    heuristic: number = 0;

    constructor(stop: Stop) {
        this.id = Vertex.nextId++;
        this.stop = stop;
        this.location = new Coordinate(stop.stopLat!, stop.stopLon!);
    }

    public get time(): Time {
        return this.graph.time.plus(this.distance);
    }

    public get parentVertex(): Vertex | undefined {
        return this.parentEdge?.source;
    }

    public get parentEdge(): DirectedWeightedEdge | undefined {
        return this.#parentEdge ?? undefined;
    }

    public get stepsFromRoot(): number {
        return this.#stepsFromRoot;
    }

    // Since the root vertex has no parent edge, the two properties should depend on each other
    public get isRoot(): boolean {
        return this.#parentEdge === null;
    }

    public get weightedHeuristic(): number {
        return PathfindingConfig.heuristicWeight * this.heuristic;
    }

    protected setRoot() {
        this.#stepsFromRoot = 0;
        this.distance = Time.of(0);
        this.visited = true;
        if (this.parentEdge !== undefined)
            throw new Error('Cannot set as root when parent edge is set');
        this.#parentEdge = null;
    }

    public set parentEdge(edge: DirectedWeightedEdge) {
        if (this.isRoot)
            return;
        this.#stepsFromRoot = edge.source.stepsFromRoot + (edge.isWalking ? 0 : 1);
        this.#parentEdge = edge;
        const headsign = edge.trip?.tripHeadsign;
        const routeName = edge.route?.routeShortName;
        let routeFullName = routeName;
        if (routeName && headsign) {
            routeFullName += ` (${headsign})`;
        }
        else if (headsign) {
            routeFullName = headsign;
        }
        this.#pathToParent = {
            name: (edge.isWalking ? 'Gyaloglás' : routeName) + ` - ${edge.weight.toString({ hours: false })}`,
            points: edge.shape,
            color: edge.isWalking ? [255, 255, 255] as [number, number, number] : hexToRgb(edge.route?.routeColor ?? '#FF0000')!,
        };
    }

    public get pathToParent(): Path | undefined {
        return this.#pathToParent;
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

    public getVerticesToRoot(): Vertex[] {
        const vertices: Vertex[] = [];
        let currentVertex: Vertex | undefined = this;
        while (currentVertex) {
            vertices.push(currentVertex);
            currentVertex = currentVertex.parentVertex;
        }
        return vertices;
    }

    async getWalkingEdges(): Promise<DirectedWeightedEdge[]> {
        if (this.isWalking())
            return [];
        if (!this.#walkingEdges) {
            this.#walkingEdges = [];
            const nearbyStops = await getNearbyStops(this.stop.stopId, PathfindingConfig.walkingDistance);
            for (const stop of nearbyStops) {
                const vertex = this.graph.getOrAddVertex(stop);
                const travelDistance = BASE_TRANSFER_TIME.plus(this.location.distanceMeters(vertex.location));
                const edge = new DirectedWeightedEdge(this, vertex, travelDistance, [this.location, vertex.location]);
                vertex.inEdges.push(edge);
                this.#walkingEdges.push(edge);
            }
        }
        return this.#walkingEdges;
    }

    async getTransitEdges(): Promise<DirectedWeightedEdge[]> {
        if (!this.#transitEdges) {
            this.#transitEdges = [];
            const neighbors = await getNeighbors(this.stop.stopId, this.time);
            for (const { stop, trip, departureTime, arrivalTime, shape, route } of neighbors) {
                const vertex = this.graph.getOrAddVertex(stop);
                const isRoot = this.isRoot || (this.parentEdge?.isWalking && this.parentVertex?.isRoot);
                const fromTime = isRoot ? Time.of(departureTime.departureTime!) : this.time;
                const distance = Time.of(arrivalTime.arrivalTime!).minus(fromTime);
                const edge = new DirectedWeightedEdge(
                    this,
                    vertex,
                    distance,
                    shape.map(s => new Coordinate(s.shapePtLat, s.shapePtLon)),
                    { trip, departureTime, arrivalTime, route }
                );
                vertex.inEdges.push(edge);
                this.#transitEdges.push(edge);
            }
        }
        return this.#transitEdges;
    }

    private isWalking() {
        return this.inEdges.some(e => e.isWalking);
    }

    public transitParentVertex() {
        if (this.parentEdge?.isWalking)
            return this.parentVertex?.parentVertex;
        return this.parentVertex;
    }
}