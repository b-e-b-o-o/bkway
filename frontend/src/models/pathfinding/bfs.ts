import type { Time } from "../time";
import type { Stop } from "src/types/gtfs";
import { PathfindingAlgo } from './pathfindingAlgo';
import { QueueDataStructure } from "./datastructures";

export class BFSPathfinding extends PathfindingAlgo {
    public data = new QueueDataStructure();

    constructor(start: Stop, end: Stop, time: Time) {
        super(start, end, time);
        this.init();
    }
}
