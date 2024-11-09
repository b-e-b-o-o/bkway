import { StopTime, Trip } from "../types/gtfs";
import { Coordinate } from "./coordinate";
import { Time } from "./time";
import { Vertex } from "./vertex";

export class DirectedWeightedEdge{
    readonly trip: Trip | undefined;
    readonly departureTime: StopTime | undefined;
    readonly arrivalTime: StopTime | undefined;

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
        { trip, departureTime, arrivalTime }:
            {
                trip: Trip;
                departureTime: StopTime;
                arrivalTime: StopTime
            } | {
                trip: null;
                departureTime: null;
                arrivalTime: null;
            } = {
                trip: null,
                departureTime: null,
                arrivalTime: null,
            },
    ) {
        this.source = source;
        this.target = target;
        this.weight = weight;
        if (trip !== null) {
            this.isWalking = false;
            this.trip = trip;
            this.departureTime = departureTime;
            this.arrivalTime = arrivalTime;
        }
    }
}
