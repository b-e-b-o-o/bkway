import { Stop } from "../../types/gtfs";
import { Vertex } from "../vertex";
import { HeapPathfinding } from './heapPathfinding';
import { Time } from "../time";

export class GreedyPathfinding extends HeapPathfinding {
    protected compare(a: Vertex, b: Vertex): number {
        return a.heuristic - b.heuristic;
    }

    constructor(start: Stop, end: Stop, time: Time) {
        super(start, end, time);
        this.init();
    }
}
