import type { Stop } from "../../../types/gtfs";
import type { Vertex } from "../../vertex";
import { HeapPathfinding } from "../heapPathfinding";
import { Time } from "../../time";

export class AStarPathfinding extends HeapPathfinding {
    public static readonly name = 'astar';
    public readonly useHeuristicWeights = true;

    protected compare(a: Vertex, b: Vertex): number {
        return (a.weightedHeuristic - b.weightedHeuristic) - Time.compare(a.distance, b.distance)
    };

    public getWeight(v: Vertex): number {
        return +v.weightedHeuristic + v.heuristic;
    }

    public constructor(start: Stop, end: Stop, time: Time) {
        super(start, end, time);
        this.init();
    }
}
