import { Route, StopTime, Trip } from "../types/gtfs";
import { Coordinate } from "./coordinate";
import { Time } from "./time";
import { Vertex } from "./vertex";

export class DirectedWeightedEdge{
    readonly trip: Trip | undefined;
    readonly departureTime: StopTime | undefined;
    readonly arrivalTime: StopTime | undefined;
    readonly route: Route | undefined;
    readonly shape: Coordinate[];

    source: Vertex;
    target: Vertex;
    weight: Time;
    isWalking: boolean = true;
    path: Coordinate[] = [];
    visited: boolean = false;

    constructor(
        source: Vertex,
        target: Vertex,
        weight: Time,
        shape: Coordinate[],
        { trip, departureTime, arrivalTime, route }:
            {
                trip: Trip;
                departureTime: StopTime;
                arrivalTime: StopTime;
                route: Route;
            } | {
                trip: null;
                departureTime: null;
                arrivalTime: null;
                route: null;
            } = {
                trip: null,
                departureTime: null,
                arrivalTime: null,
                route: null,
            },
    ) {
        this.source = source;
        this.target = target;
        this.weight = weight;
        this.shape = shape;
        if (trip !== null) {
            this.isWalking = false;
            this.trip = trip;
            this.departureTime = departureTime;
            this.arrivalTime = arrivalTime;
            this.route = route;
        }
    }
}
