import type { Stop } from "../../types/gtfs";
import type { Vertex } from "../vertex";
import { HeapPathfinding } from "./heapPathfinding";
import { Time } from "../time";

export class AStarPathfinding extends HeapPathfinding {
    protected compare(a: Vertex, b: Vertex): number {
        return  (a.heuristic - b.heuristic) - Time.compare(a.distance, b.distance)
    };

    public constructor(start: Stop, end: Stop, time: Time) {
        super(start, end, time);
        this.init();
    }
}
