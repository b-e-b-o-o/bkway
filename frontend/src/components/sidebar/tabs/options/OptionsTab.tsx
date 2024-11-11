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

function now() {
    return dayjs().tz('Europe/Budapest').second(0).millisecond(0);
}

export default function OptionsTab() {
    const { pathfinding, setPathfinding, setIncompletePaths, setCompletePath } = usePathfindingContext();

    const [startStop, setStartStop] = useState<Stop>();
    const [endStop, setEndStop] = useState<Stop>();
    const [startTime, setStartTime] = useState(now());
    useEffect(() => {
        if (!startStop || !endStop)
            return;
        const graph = new Graph(Time.of(startTime), startStop);
        setIncompletePaths([]);
        setCompletePath(undefined);
        setPathfinding(new BFSPathfinding(graph, endStop.stopId));
        return () => setPathfinding(undefined);
    }, [startStop, endStop, startTime]);

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
            // await new Promise(resolve => setTimeout(resolve, 100));
        } while (go.current);
    }

    return <>
        <SearchBar placeholder='Indulás...' stop={startStop} setStop={setStartStop} />
        <SearchBar placeholder='Érkezés...' stop={endStop} setStop={setEndStop} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', gap: '10px' }}>
            <Box sx={{ display: 'flex', minWidth: 'fit-content', alignSelf: 'center' }}>Indulási idő:</Box>
            <Box sx={{ display: 'flex', gap: '10px' }}>
                <Button variant='outlined' type='reset' onClick={() => setStartTime(now())}> Most </Button>
                <TimePicker ampm={false} value={startTime} onChange={(e) => e && setStartTime(e)} sx={{ maxWidth: '150px' }} />
            </Box>
        </Box>
        <Button onClick={step} variant="contained">
            Következő lépés
        </Button>
        <Button onClick={async () => { go.current = !go.current; await step(); }} variant="contained">
            lépkedés {go.current ? 'stop' : 'go'}
        </Button>
    </>
}
