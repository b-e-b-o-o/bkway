import SearchBar from './SearchBar';
import { TimePicker } from '@mui/x-date-pickers';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { BFSPathfinding } from '../../../../models/pathfinding/bfs';
import { DijkstraPathfinding } from '../../../../models/pathfinding/dijkstra';
import { GreedyPathfinding } from '../../../../models/pathfinding/greedy';
import { AStarPathfinding } from '../../../../models/pathfinding/astar';
import { Time } from '../../../../models/time';
import { usePathfindingContext } from '../../../../contexts/pathfinding.context';
import dayjs from 'dayjs';
import type { Stop } from '../../../../types/gtfs';
import { useUpdateEffect } from '../../../../utils/util';

function now() {
    return dayjs().tz('Europe/Budapest').second(0).millisecond(0);
}

export default function OptionsTab() {
    const { pathfinding, setPathfinding, setIncompletePaths, setCompletePath } = usePathfindingContext();

    const [startStop, setStartStop] = useState<Stop | undefined>(pathfinding?.start.stop);
    const [endStop, setEndStop] = useState<Stop | undefined>(pathfinding?.end.stop);
    const [startTime, setStartTime] = useState(now());

    const pathfindings = {
        'bfs': BFSPathfinding,
        'dijkstra': DijkstraPathfinding,
        'greedy': GreedyPathfinding,
        'astar': AStarPathfinding
    }
    const [variant, setVariant] = useState<keyof typeof pathfindings>('bfs');

    useUpdateEffect(() => {
        if (!startStop || !endStop)
            return;
        setCompletePath(undefined);
        setPathfinding(new pathfindings[variant](startStop, endStop, Time.of(startTime)));
    }, [startStop, endStop, startTime, variant]);

    // This might as well be moved to App.tsx, but I'd like to keep the logic in the same file
    useUpdateEffect(() => {
        if (pathfinding === undefined)
            return;
        (async () => {
            await (pathfinding as any).nextWalking();
            setIncompletePaths(pathfinding.getIncompletePaths());
        })();
    }, [pathfinding]);

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
        <FormControl fullWidth>
            <InputLabel id="algorithm-select-label">Algoritmus</InputLabel>
            <Select
                labelId="algorithm-select-label"
                id="algorithm-select"
                value={variant}
                label="Algoritmus"
                onChange={(v: any) => setVariant(v.target.value)}
            >
                <MenuItem value='bfs'>BFS</MenuItem>
                <MenuItem value='dijkstra'>Dijkstra-algoritmus</MenuItem>
                <MenuItem value='greedy'>Mohó algoritmus</MenuItem>
                <MenuItem value='astar'>A* algoritmus</MenuItem>
            </Select>
        </FormControl>
    </>
}
