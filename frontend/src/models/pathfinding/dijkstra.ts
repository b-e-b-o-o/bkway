import { Time } from "../time";
import type { Stop } from "src/types/gtfs";
import { PathfindingAlgo } from './pathfindingAlgo';
import { HeapDataStructure } from './datastructures';

export class DijkstraPathfinding extends PathfindingAlgo {
    public data = new HeapDataStructure(
        // This is a max heap by default, we need a min heap
        (a, b) => -Time.compare(a.distance, b.distance)
    );

    public constructor(start: Stop, end: Stop, time: Time) {
        super(start, end, time);
        this.init();
    }
}
