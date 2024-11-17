import { Vertex } from "../vertex";
import { PathfindingAlgo } from './pathfindingAlgo';
import { HeapDataStructure } from './datastructures';

export abstract class HeapPathfinding extends PathfindingAlgo {
    protected abstract compare(a: Vertex, b: Vertex): number;
    public readonly data = new HeapDataStructure(this.compare);
}
