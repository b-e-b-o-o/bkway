import { Vertex } from "../vertex";
import { Pathfinding } from './pathfinding';
import { HeapDataStructure } from './datastructures';

export abstract class HeapPathfinding extends Pathfinding {
    protected abstract compare(a: Vertex, b: Vertex): number;
    public readonly data = new HeapDataStructure(this.compare);
}
