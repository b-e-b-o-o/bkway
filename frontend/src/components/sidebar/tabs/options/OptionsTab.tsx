import SearchBar from './SearchBar';
import { TimePicker } from '@mui/x-date-pickers';
import { Box, Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Graph } from '../../../../models/graph';
import { BFSPathfinding } from '../../../../models/pathfinding/bfs';
import { Time } from '../../../../models/time';
import { usePathfindingContext } from '../../../../contexts/pathfinding.context';
import dayjs from 'dayjs';
import type { Stop } from '../../../../types/gtfs';


export default function OptionsTab() {
    const { pathfinding, setPathfinding, setIncompletePaths, setCompletePath } = usePathfindingContext();

    const [startStop, setStartStop] = useState<Stop>();
    const [endStop, setEndStop] = useState<Stop>();
    const [startTime, setStartTime] = useState(dayjs().tz('Europe/Budapest'));
    useEffect(() => {
        if (!startStop || !endStop)
            return;
        const graph = new Graph(Time.of(startTime), startStop);
        setPathfinding(new BFSPathfinding(graph, endStop.stopId));
        return () => setPathfinding(undefined);
    }, [startStop, endStop, startTime]);

    const go = useRef(false);

    async function step() {
        do {
            if (pathfinding === undefined || pathfinding.isFinished) {
                console.log('done');
                go.current = false;
                setCompletePath(pathfinding?.end?.getPathToRoot() ?? []);
                break;
            }
            await pathfinding.next();
            setIncompletePaths((pathfinding as BFSPathfinding).getUnfinishedPaths());
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