import type { Time } from "../time";
import type { Stop } from "src/types/gtfs";
import type { Path } from "../../types/mapdata";
import { Vertex } from "../vertex";
import { Pathfinding } from "./pathfinding";

export class BFSPathfinding extends Pathfinding {
    public queue: Vertex[] = [];

    constructor(start: Stop, end: Stop, time: Time) {
        super(start, end, time);
        this.queue.push(this.start);
    }

    public getIncompletePaths(): Path[] {
        const vertices = new Set<Vertex>();
        for (const v of this.queue) {
            let current: Vertex | undefined = v;
            while (current && !vertices.has(current)) {
                vertices.add(current);
                current = current.parentVertex;
            }
        }
        const paths: Path[] = [];
        for (const v of vertices) {
            const path = v.pathToParent;
            if (path)
                paths.push(path);
        }
        return paths;
    }

    public prune() {
        this.queue = this.queue.filter(v => v.id === this.end.id);
    }

    // Returns updated edges end vertices
    public async next(): Promise<Vertex[]> {
        if (this.isFinished) {
            console.log(this.getCompletePath());
            return [];
        }

        const current = this.queue.shift()!;
        const outEdges = await current.getOutEdges();  //.filter(e => !e.visited);
        for (const e of outEdges) {
            e.visited = true;
            const v = e.target;
            if (v.visited)
                continue;
            v.visited = true;
            v.distance = current.distance.plus(e.weight);
            v.parentEdge = e;
            this.queue.push(v);
            if (v.id === this.end.id) {
                this.end = v;
                return [current];
            }
        }
        return [current];
    }
}
