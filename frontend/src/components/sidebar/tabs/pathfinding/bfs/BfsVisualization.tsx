import type { BFSPathfinding } from "src/models/pathfinding/bfs";
import TripCard from "../common/TripCard";
import { Box } from "@mui/material";

interface BfsVisualizationProps {
    bfs: BFSPathfinding
}

export default function BfsVisualization(props: BfsVisualizationProps) {
    const { bfs: pathfinding } = props;
    return <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'stretch', height: '100%' }}>{
        pathfinding.isFinished ?
            <>
                <div>
                    Út ({pathfinding.getCompletePathVertices()?.length ?? '?'} megálló)
                    <hr />
                </div>
                {pathfinding.getCompletePathVertices()?.map((v, i) => <TripCard vertex={v} key={i} />)}
            </> :
            <>
                <div>
                    Sor ({pathfinding.queue.length} megálló)
                    <hr />
                </div>
                {pathfinding.queue.map((v, i) => <TripCard vertex={v} key={i} />)}
            </>
    }</Box>
}
