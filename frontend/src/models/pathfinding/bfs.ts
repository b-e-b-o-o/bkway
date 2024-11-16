import type { Time } from "../time";
import type { Stop } from "src/types/gtfs";
import type { Path } from "../../types/mapdata";
import { Vertex } from "../vertex";
import { Pathfinding } from "./pathfinding";
import { DirectedWeightedEdge } from "../directedWeightedEdge";

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

    public async nextWalking() {
        const v = this.queue[0]; // We don't remove from queue
        if (!v) return;
        for await (const e2 of v.getWalkingEdges()) {
            this.visit(e2);
        }
    }

    // Returns updated edges end vertices
    public async next(): Promise<Vertex[]> {
        if (this.isFinished) {
            console.log(this.getCompletePath());
            return [];
        }

        const current = this.queue.shift()!;
        const outEdges = current.getTransitEdges();
        for await (const e of outEdges) {
            this.visit(e);
            console.log(e);
            for await (const e2 of e.target.getWalkingEdges()) {
                this.visit(e2);
            }
        }
        return [current];
    }

    private async visit(e: DirectedWeightedEdge) {
        e.visited = true;
        const v = e.target;
        if (v.visited)
            return;
        v.visited = true;
        v.distance = e.source.distance.plus(e.weight);
        v.parentEdge = e;
        this.queue.push(v);
        if (v.id === this.end.id) {
            this.end = v;
        }
    }
}
