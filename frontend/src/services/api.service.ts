import type { Route, Shape, Stop, StopTime, Trip } from "../types/gtfs";

import type { Time } from "../models/time";

export namespace ApiConfig {
    export const baseUrl = import.meta.env.BACKEND ?? 'http://127.0.0.1:3333';
};

export async function searchStops(query: string, { signal }: { signal?: AbortSignal } = {}) {
   const resp = await fetch(`${ApiConfig.baseUrl}/stops/search?q=${query}`, { signal, keepalive: true });
   return resp.json() as Promise<{ stop: Stop, routes: Route[] }[]>;
}

export async function getNeighbors(stopId: string, time: Time, { signal }: { signal?: AbortSignal } = {}) {
    const resp = await fetch(`${ApiConfig.baseUrl}/stops/${stopId}/neighbors?time=${time}`, { signal, keepalive: true });
    return resp.json() as Promise<{
        stop: Stop,
        trip: Trip,
        departureTime: StopTime,
        arrivalTime: StopTime,
        route: Route,
        shape: Pick<Shape, 'shapePtLat' | 'shapePtLon'>[]
    }[]>;
}

export async function getNearbyStops(stopId: string, distance = 150, { signal }: { signal?: AbortSignal } = {}) {
    const resp = await fetch(`${ApiConfig.baseUrl}/stops/${stopId}/nearby?distance=${distance}`, { signal, keepalive: true });
    return resp.json() as Promise<Stop[]>;
}
