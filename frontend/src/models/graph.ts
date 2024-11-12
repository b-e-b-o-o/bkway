import type { Stop } from "../types/gtfs";
import { Time } from "./time";
import { Vertex } from "./vertex";

export class Graph {
    protected isRootSet = false;
    
    private readonly Vertex = (() => {
        const thisGraph = this;
        return class extends Vertex {
            public graph = thisGraph;

            // Has to happen here because isRootSet is protected
            public constructor(stop: Stop) {
                super(stop);
                // The first vertex is automatically set as the root
                if (!thisGraph.isRootSet)
                    this.setRoot();
            }

            protected override setRoot() {
                if (thisGraph.isRootSet)
                    throw new Error('Root already set');
                super.setRoot();
                thisGraph.isRootSet = true;
            }
        };
    })();

    readonly vertices: Map<string, Vertex>;
    readonly time: Time;

    constructor(time: Time) {
        this.vertices = new Map<string, Vertex>();
        this.time = time;
    }

    getVertex(id: string) {
        return this.vertices.get(id);
    }

    getOrAddVertex(stop: Stop) {
        let vertex = this.vertices.get(stop.stopId);
        if (vertex === undefined) {
            vertex = new this.Vertex(stop);
            this.vertices.set(stop.stopId, vertex);
        }
        return vertex;
    }
}
