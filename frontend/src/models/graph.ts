import type { Stop } from "../types/gtfs";
import { Time } from "./time";
import { Vertex } from "./vertex";

export class Graph {
    private readonly Vertex = (() => {
        const thisGraph = this;
        return class extends Vertex {
            public graph = thisGraph;
        };
    })();

    vertices: Map<string, Vertex>;
    time: Time;
    constructor(time: Time, startStop: Stop) {
        this.vertices = new Map<string, Vertex>();
        this.time = time;
        this.getOrAddVertex(startStop.stopId, startStop).distance = Time.of(0);
    }

    getVertex(id: string) {
        return this.vertices.get(id);
    }

    getOrAddVertex(id: string, stop: Stop) {
        let vertex = this.vertices.get(id);
        if (vertex === undefined) {
            vertex = new this.Vertex(id, stop);
            this.vertices.set(id, vertex);
        }
        return vertex;
    }
}
