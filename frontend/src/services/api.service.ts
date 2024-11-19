import type { Route, Shape, Stop, StopTime, Trip } from "../types/gtfs";

import type { Time } from "../models/time";

export namespace ApiConfig {
    export const baseUrl = 'http://127.0.0.1:3333';
    /** Maximum distance when searching for stops in walking distance (m) */
    export let walkingDistance = 150;
};

async function getStoptimes(stopId: string, from: string, to: string) {
    const params = new URLSearchParams();
    params.append('stop', stopId);
    params.append('from', from);
    params.append('to', to);
    const resp = await fetch(`${ApiConfig.baseUrl}/stoptimes?${params.toString()}`);
    return resp.json() as Promise<Pick<
        StopTime,
        'tripId' | 'departureTime' | 'departureTimestamp' | 'stopId' | 'stopSequence' | 'stopHeadsign' | 'shapeDistTraveled'
    >[]>;
}

export async function getNeighbors(stopId: string, time: Time) {
    const resp = await fetch(`${ApiConfig.baseUrl}/stops/${stopId}/neighbors?time=${time}`, { keepalive: true });
    return resp.json() as Promise<{
        stop: Stop,
        trip: Trip,
        departureTime: StopTime,
        arrivalTime: StopTime,
        route: Route,
        shape: Pick<Shape, 'shapePtLat' | 'shapePtLon'>[]
    }[]>;
}

export async function getNearbyStops(stopId: string) {
    console.log(ApiConfig.walkingDistance);
    const resp = await fetch(`${ApiConfig.baseUrl}/stops/${stopId}/nearby`, { keepalive: true });
    return resp.json() as Promise<Stop[]>;
}
