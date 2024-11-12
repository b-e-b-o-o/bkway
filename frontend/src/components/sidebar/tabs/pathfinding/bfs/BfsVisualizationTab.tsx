import type { BFSPathfinding } from "src/models/pathfinding/bfs";
import TripCard from "../common/TripCard";

interface BfsVisualizationTabProps {
    bfs: BFSPathfinding
}

export default function BfsVisualizationTab(props: BfsVisualizationTabProps) {
    const { bfs: pathfinding } = props;
    return <>{
        pathfinding.isFinished ?
            <>
                <div>
                    kész!
                    <hr />
                </div>
                {
                    pathfinding.getCompletePathVertices()?.map((v, i) =>
                        <TripCard vertex={v} key={i} />
                    )
                }
            </> :
            <>
                <div>
                    Sor
                    <hr />
                </div>
                {
                    pathfinding.queue.map((v, i) =>
                        <TripCard vertex={v} key={i} />
                    )
                }
            </>
    }</>
}