import type { Stop } from "src/types/gtfs";
import type { Vertex } from "../vertex";
import { HeapPathfinding } from "./heapPathfinding";
import { Time } from "../time";

export class DijkstraPathfinding extends HeapPathfinding {
    protected compare(a: Vertex, b: Vertex): number {
        return -Time.compare(a.distance, b.distance)
    };

    public getWeight(v: Vertex): number {
        return +v.distance;
    }

    public constructor(start: Stop, end: Stop, time: Time) {
        super(start, end, time);
        this.init();
    }
}
