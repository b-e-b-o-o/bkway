import type { IDataStructure } from "./datastructures";
import type { Stop } from "src/types/gtfs";
import type { Path } from "../../types/mapdata";
import { DirectedWeightedEdge } from "../directedWeightedEdge";
import { Pathfinding } from "./pathfinding";
import { Vertex } from "../vertex";
import { Time } from "../time";

export abstract class PathfindingAlgo extends Pathfinding {
    public readonly abstract data: IDataStructure;

    constructor(start: Stop, end: Stop, time: Time) {
        super(start, end, time);
    }

    protected init() {
        this.data.push(this.start);
    }

    public getIncompletePaths(): Path[] {
        const vertices = new Set<Vertex>();
        for (const v of this.data.elements()) {
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

    public async nextWalking() {
        const v = this.data.peek();
        if (!v) return;
        for (const e2 of await v.getWalkingEdges()) {
            e2.weight = Time.of(0);
            this.visit(e2);
        }
    }

    // Returns updated edges end vertices
    public async next(): Promise<Vertex[]> {
        if (this.isFinished) {
            console.log(this.getCompletePath());
            return [];
        }

        const current = this.data.pop()!;
        const outEdges = await current.getTransitEdges();
        for (const e of outEdges) {
            this.visit(e);
            for (const e2 of await e.target.getWalkingEdges()) {
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
        v.heuristic = v.location.distanceMeters(this.end.location);
        v.parentEdge = e;
        this.data.push(v);
        if (v.id === this.end.id) {
            this.end = v;
        }
    }
}
