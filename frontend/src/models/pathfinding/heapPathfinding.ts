import { Pathfinding } from './pathfinding';
import { HeapDataStructure } from './datastructures';

export abstract class HeapPathfinding extends Pathfinding {
    public readonly data = new HeapDataStructure((a, b) => this.getWeight(a) - this.getWeight(b));
}
