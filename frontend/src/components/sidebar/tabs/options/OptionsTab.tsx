import SearchBar from './SearchBar';
import { TimePicker } from '@mui/x-date-pickers';
import { Box, Button, Divider, FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BFSPathfinding } from '../../../../models/pathfinding/bfs';
import { DijkstraPathfinding } from '../../../../models/pathfinding/dijkstra';
import { GreedyPathfinding } from '../../../../models/pathfinding/greedy';
import { AStarPathfinding } from '../../../../models/pathfinding/astar';
import { Time } from '../../../../models/time';
import { usePathfindingContext } from '../../../../contexts/pathfinding.context';
import dayjs from 'dayjs';
import type { Stop } from '../../../../types/gtfs';
import { useUpdateEffect } from '../../../../utils/util';
import { ApiConfig } from '../../../../services/api.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';

function now() {
    return dayjs().tz('Europe/Budapest').second(0).millisecond(0);
}

export default function OptionsTab() {
    const { pathfinding, setPathfinding, setIncompletePaths, setCompletePath } = usePathfindingContext();

    const [startStop, setStartStop] = useState<Stop | undefined>(pathfinding?.start.stop);
    const [endStop, setEndStop] = useState<Stop | undefined>(pathfinding?.end.stop);
    const [startTime, setStartTime] = useState(now());
    const [walkingDistance, setWalkingDistance] = useState(ApiConfig.walkingDistance);

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
    }, [startStop, endStop, startTime, variant, walkingDistance]);

    // This might as well be moved to App.tsx, but I'd like to keep the logic in the same file
    useUpdateEffect(() => {
        if (pathfinding === undefined)
            return;
        (async () => {
            await (pathfinding as any).nextWalking();
            setIncompletePaths(pathfinding.getIncompletePaths());
        })();
    }, [pathfinding]);

    useEffect(() => {
        ApiConfig.walkingDistance = walkingDistance;
    }, [walkingDistance]);

    return <>
        <Divider sx={{ color: '#eee' }} > Útvonal beállításai </Divider>
        <SearchBar placeholder='Indulás...' stop={startStop} setStop={setStartStop} />
        <Box sx={{ position: 'relative', height: 0, width: '100%' }}>
            <Button sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: '24px', width: '24px', height: '24px' }} onClick={() => { setStartStop(endStop); setEndStop(startStop) }}>
                <FontAwesomeIcon icon={faArrowRightArrowLeft} color='white' width={24} height={24} /*rotation={90}*/ />
            </Button>
        </Box>
        <SearchBar placeholder='Érkezés...' stop={endStop} setStop={setEndStop} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', gap: '10px' }}>
            <Box sx={{ display: 'flex', minWidth: 'fit-content', alignSelf: 'center' }}>Indulási idő:</Box>
            <Box sx={{ display: 'flex', gap: '10px' }}>
                <Button variant='outlined' type='reset' onClick={() => setStartTime(now())}> Most </Button>
                <TimePicker ampm={false} value={startTime} onChange={(e) => e && setStartTime(e)} sx={{ maxWidth: '150px' }} />
            </Box>
        </Box>
        <Divider sx={{ color: '#eee' }} > Algoritmus beállításai </Divider>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', gap: '10px' }}>
            <Box sx={{ display: 'flex', minWidth: 'fit-content', alignSelf: 'center' }} id="walking-distance-helper-text">
                Gyalogos távolság:
            </Box>
            <OutlinedInput
                id="walking-distance"
                type="number"
                fullWidth
                sx={{ maxWidth: '150px' }}
                endAdornment={<InputAdornment position="end">m</InputAdornment>}
                value={walkingDistance}
                aria-describedby="walking-distance-helper-text"
                onChange={(e) => {
                    const newValue = Number.parseInt(e.target.value, 10);
                    if (newValue && newValue !== ApiConfig.walkingDistance) {
                        ApiConfig.walkingDistance = newValue;
                        setWalkingDistance(newValue);
                    }
                }}
            />
        </Box>
    </>
}
