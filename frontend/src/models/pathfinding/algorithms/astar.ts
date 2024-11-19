import type { Stop } from "../../../types/gtfs";
import type { Vertex } from "../../vertex";
import { HeapPathfinding } from "../heapPathfinding";
import { Time } from "../../time";

export class AStarPathfinding extends HeapPathfinding {
    public static readonly name = 'astar';
    public readonly useHeuristicWeights = true;

    public getWeight(v: Vertex): number {
        return +v.weightedHeuristic + +v.distance;
    }

    public constructor(start: Stop, end: Stop, time: Time) {
        super(start, end, time);
        this.init();
    }
}
