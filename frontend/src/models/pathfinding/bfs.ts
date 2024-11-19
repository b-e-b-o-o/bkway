import type { Vertex } from "../vertex";
import type { Time } from "../time";
import type { Stop } from "../../types/gtfs";
import { Pathfinding } from './pathfinding';
import { QueueDataStructure } from "./datastructures";

export class BFSPathfinding extends Pathfinding {
    public data = new QueueDataStructure();

    public getWeight(v: Vertex): number {
        return v.stepsFromRoot;
    }

    constructor(start: Stop, end: Stop, time: Time) {
        super(start, end, time);
        this.init();
    }
}
