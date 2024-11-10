import type { BFSPathfinding } from "src/models/pathfinding/bfs";
import TripCard from "../common/TripCard";

interface BfsVisualizationProps {
    pathfinding: BFSPathfinding
}

export default function BfsVisualization(props: BfsVisualizationProps) {
    const { pathfinding } = props;
    return <div>
        {
            pathfinding.queue.map((v, i) =>
                <TripCard />
            )
        }
    </div>
}