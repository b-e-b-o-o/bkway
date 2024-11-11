import type { BFSPathfinding } from "src/models/pathfinding/bfs";
import TripCard from "../common/TripCard";

interface BfsVisualizationTabProps {
    bfs: BFSPathfinding
}

export default function BfsVisualizationTab(props: BfsVisualizationTabProps) {
    const { bfs: pathfinding } = props;
    return <div>
        {
            pathfinding.queue.map((v, i) =>
                <TripCard edge={v.inEdges[0]} key={i} />
            )
        }
    </div>
}