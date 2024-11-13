import { Box } from "@mui/material";
import { BFSPathfinding } from "../../../../models/pathfinding/bfs";
import { usePathfindingContext } from '../../../../contexts/pathfinding.context';
import BfsVisualization from "./bfs/BfsVisualization";
import PathfindingController from "./common/PathfindingController";

export default function PathfindingTab() {
    const { pathfinding } = usePathfindingContext();

    function PathfindingVisualization() {
        if (pathfinding instanceof BFSPathfinding)
            return <BfsVisualization bfs={pathfinding} />;
        return <></>;
    }

    if (!pathfinding)
        return <></>;

    return <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'stretch' }}>
        <PathfindingController />
        <PathfindingVisualization />
    </Box>
}
