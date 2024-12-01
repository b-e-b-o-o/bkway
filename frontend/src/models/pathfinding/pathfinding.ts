import type { IDataStructure } from "./datastructures";
import type { Path } from "../../types/mapdata";
import { Time } from "../time";
import { Vertex } from "../vertex";
import { Graph } from "../graph";
import { Stop } from "../../types/gtfs";
import { DirectedWeightedEdge } from "../directedWeightedEdge";

export abstract class Pathfinding {
    public static readonly name: string;
    public readonly useHeuristicWeights: boolean = false;

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
        console.log(`${this.constructor.name} pathfinding from ${this.start.stop.stopId} to ${this.end.stop.stopId}`);
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
        return this.end.visited || this.end === this.start;
    }

    public abstract getWeight(v: Vertex): number;

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
        while (currentVertex) {
            vertices.push(currentVertex);
            currentVertex = currentVertex.parentVertex;
        };
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
        if (this.isFinished)
            return;
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
        current.visited = true;
        if (current === this.end) return;
        const outEdges = await current.getTransitEdges();
        for (const e of outEdges) {
            this.visit(e);
            for (const e2 of await e.target.getWalkingEdges()) {
                this.visit(e2);
            }
        }
    }

    private visit(e: DirectedWeightedEdge) {
        e.visited = true;
        const v = e.target;
        if (v.isRoot) {
            return;
        }
        if (v.visited) {
            this.data.remove(v);
        }
        else {
            v.heuristic = v.location.distanceMeters(this.end.location);
        }
        const newDistance = e.source.distance.plus(e.weight);
        if (newDistance.before(v.distance)) {
            v.parentEdge = e;
            v.distance = newDistance;
            this.data.push(v);
            if (v.visited) {
                for (const e of v.getKnownWalkingEdges())
                    this.visit(e);
            }
        }
    }
}
