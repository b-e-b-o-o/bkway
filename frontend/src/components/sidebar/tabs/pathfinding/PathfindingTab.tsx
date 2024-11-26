import Box from "@mui/material/Box";
import { HeapPathfinding } from "../../../../models/pathfinding/heapPathfinding";
import { usePathfindingContext } from '../../../../contexts/pathfinding.context';
import PathfindingController from "./common/PathfindingController";
import TripCard from "./common/TripCard";

export default function PathfindingTab() {
    const { pathfinding } = usePathfindingContext();

    if (!pathfinding)
        return <></>;

    const isHeap = pathfinding instanceof HeapPathfinding;

    return <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'stretch', height: '100%' }}>
        <PathfindingController />
        <Box sx={{ overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'stretch', height: '100%' }}>{
                pathfinding.isFinished ?
                    <>
                        <div>
                            Út ({pathfinding.getCompletePathVertices()?.length ?? '?'} megálló)
                            <hr />
                        </div>
                        {pathfinding.getCompletePathVertices()?.map((v, i) => <TripCard vertex={v} key={i} showRouteFromRoot={false} />)}
                    </> :
                    <>
                        <div>
                            {isHeap ? 'Prioritási sor' : 'Sor'} ({pathfinding.data.size} megálló)
                            <hr />
                        </div>
                        {Array.from(pathfinding.data.elements()).map((v, i) => <TripCard vertex={v} key={i} />)}
                    </>
            }</Box>
        </Box>
    </Box>
}
