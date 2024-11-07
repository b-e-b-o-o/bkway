import { Stop, StopTime, Trip } from "src/types/gtfs";

const baseUrl = 'http://localhost:3333';

export function getStoptimes(stopId: string, from: string, to: string) {
    const params = new URLSearchParams();
    params.append('stop', stopId);
    params.append('from', from);
    params.append('to', to);
    return fetch(`${baseUrl}/stoptimes?${params.toString()}`)
        .then(response => response.json());
}

export async function getNeighbors(stopId: string, time: string) {
    const resp = await fetch(`${baseUrl}/stops/${stopId}/neighbors?time=${time}`);
    return resp.json() as Promise<{ stop: Stop, trip: Trip, departureTime: StopTime, arrivalTime: StopTime }[]>;
}

export async function getNearbyStops(stopId: string) {
    const resp = await fetch(`${baseUrl}/stops/${stopId}/nearby`);
    return resp.json() as Promise<Stop[]>;
}
