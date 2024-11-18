import type { IDataStructure } from "./datastructures";
import type { Path } from "../../types/mapdata";
import { Time } from "../time";
import { Vertex } from "../vertex";
import { Graph } from "../graph";
import { Stop } from "../../types/gtfs";
import { DirectedWeightedEdge } from "../directedWeightedEdge";

export abstract class Pathfinding {
    public readonly abstract data: IDataStructure;
    #path: Path[] | undefined;
    #graph: Graph;
    #start: Vertex;
    #end: Vertex;
    
    constructor(start: Stop, end: Stop, time: Time) {
        Vertex.nextId = 0;
        this.#graph = new Graph(time);
        this.#start = this.graph.getOrAddVertex(start);
        this.#end = this.graph.getOrAddVertex(end);
    }

    protected init() {
        this.data.push(this.start);
        console.log('pathfinding from %s to %s', this.start.stop.stopId, this.end.stop.stopId);
    }

    public reset() {
        this.data.clear();
        this.#graph = new Graph(this.graph.time);
        this.#start = this.graph.getOrAddVertex(this.start.stop);
        this.#end = this.graph.getOrAddVertex(this.end.stop);
        this.init();
    }

    public get graph(): Graph {
        return this.#graph;
    }

    public get start(): Vertex {
        return this.#start;
    }

    public get end() {
        return this.#end;
    }

    protected set end(v: Vertex) {
        if (this.#end.id !== v.id)
            throw new Error('Cannot set end to a different vertex');
        this.#end = v;
    }

    public get isFinished(): boolean {
        // This also checks for edge case where end === start
        return this.end.parentVertex !== undefined;
    }

    public getCompletePath() { 
        if (!this.isFinished)
            return;
        if (this.#path === undefined)
            this.#path = this.end.getPathToRoot();
        return this.#path;
    }

    public getCompletePathVertices() {
        if (!this.isFinished)
            return;
        const vertices: Vertex[] = [];
        let currentVertex: Vertex | undefined = this.end;
        // Doesn't include root (on purpose!)
        do {
            vertices.push(currentVertex);
            currentVertex = currentVertex.parentVertex;
        } while (currentVertex?.parentVertex);
        vertices.reverse();
        return vertices;
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

    public async next() {
        if (this.isFinished) {
            console.log(this.getCompletePath());
            return;
        }

        const current = this.data.pop()!;
        const outEdges = await current.getTransitEdges();
        for (const e of outEdges) {
            this.visit(e);
            for (const e2 of await e.target.getWalkingEdges()) {
                this.visit(e2);
            }
        }
    }

    private async visit(e: DirectedWeightedEdge) {
        e.visited = true;
        const v = e.target;
        const isSameSource = e.source === v.transitParentVertex();
        if (v.visited && (!isSameSource || v.parentEdge === e))
            return;
        v.heuristic = v.location.distanceMeters(this.end.location);
        const newDistance = e.source.distance.plus(e.weight);
        if (v.parentEdge === undefined || (isSameSource && v.distance.after(newDistance))) {
            v.distance = newDistance;
            v.parentEdge = e;
        }
        if (!v.visited)
            this.data.push(v);
        v.visited = true;
        if (v.id === this.end.id) {
            this.end = v;
        }
    }
}
