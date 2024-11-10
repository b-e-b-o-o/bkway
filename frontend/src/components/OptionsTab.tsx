import SearchBar from './SearchBar';
import { TimePicker } from '@mui/x-date-pickers';
import { Box, Button } from '@mui/material';
import { useMemo, useRef } from 'react';
import { Graph } from '../models/graph';
import { BFSPathfinding } from '../models/pathfinding/bfs';
import { Time } from '../models/time';
import { useRoutePlanContext } from '../contexts/routePlan.context';


export default function OptionsTab() {
    const { setPaths, startStop, setStartStop, endStop, setEndStop, startTime, setStartTime } = useRoutePlanContext();

    const pathfinding = useMemo(() => {
        if (!startStop || !endStop)
            return;
        const graph = new Graph(Time.of(startTime), startStop);
        const startVertex = graph.getOrAddVertex(startStop.stopId, startStop);
        return startStop && endStop && new BFSPathfinding(startVertex, endStop.stopId)
    }, [startStop, endStop, startTime]);

    const go = useRef(false);

    async function step() {
        do {
            if (pathfinding === undefined || pathfinding.isFinished) {
                console.log('done');
                go.current = false;
                setPaths(pathfinding?.end?.getPathToRoot() ?? []);
                break;
            }
            await pathfinding.next();
            setPaths(pathfinding.getUnfinishedPaths());
            // await new Promise(resolve => setTimeout(resolve, 100));
        } while (go.current);
    }

    return <>
        <SearchBar placeholder='Indulás...' stop={startStop} setStop={setStartStop} />
        <SearchBar placeholder='Érkezés...' stop={endStop} setStop={setEndStop} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>Indulási idő:</Box>
            <TimePicker ampm={false} defaultValue={startTime} onChange={(e) => e && setStartTime?.(e)} />
        </Box>
        <Button onClick={step} variant="contained">
            Következő lépés
        </Button>
        <Button onClick={async () => { go.current = !go.current; await step(); }} variant="contained">
            lépkedés {go.current ? 'stop' : 'go'}
        </Button>
    </>
}