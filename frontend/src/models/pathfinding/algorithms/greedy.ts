import { Stop } from "../../../types/gtfs";
import { Vertex } from "../../vertex";
import { HeapPathfinding } from '../heapPathfinding';
import { Time } from "../../time";

export class GreedyPathfinding extends HeapPathfinding {
    public static readonly name = 'greedy';

    public getWeight(v: Vertex): number {
        return v.heuristic;
    }

    constructor(start: Stop, end: Stop, time: Time) {
        super(start, end, time);
        this.init();
    }
}
