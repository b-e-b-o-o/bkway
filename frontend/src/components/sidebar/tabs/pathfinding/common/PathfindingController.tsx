import { useRef } from 'react';
import { Box, Button } from '@mui/material';
import { usePathfindingContext } from '../../../../../contexts/pathfinding.context';
import { BFSPathfinding } from '../../../../../models/pathfinding/bfs';

export default function PathfindingController() {
    const { pathfinding, setPathfinding, setIncompletePaths, setCompletePath } = usePathfindingContext();

    // Has to be a ref otherwise the state gets lost on rerender(?)
    const go = useRef(false);

    async function step() {
        do {
            if (pathfinding === undefined || pathfinding.isFinished) {
                console.log('done');
                go.current = false;
                setCompletePath(pathfinding?.getCompletePath() ?? []);
                break;
            }
            await pathfinding.next();
            setIncompletePaths(pathfinding.getIncompletePaths());
            await new Promise(resolve => setTimeout(resolve, 100));
        } while (go.current);
    }

    return <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {pathfinding?.isFinished ?
            <>
                {/* <Button onClick={() => setPathfinding(new BFSPathfinding(pathfinding!.start.stop!, pathfinding!.end.stop!, pathfinding!.start.time!))} variant="contained"> */}
            </> :
            <>
                <Button onClick={async () => await step()} variant="contained" disabled={pathfinding?.isFinished || go.current}>
                    Következő lépés
                </Button>
                <Button onClick={async () => { go.current = !go.current; await step(); }} variant="contained" disabled={pathfinding?.isFinished}>
                    lépkedés {go.current ? 'stop' : 'go'}
                </Button>
            </>
        }
    </Box>
}
