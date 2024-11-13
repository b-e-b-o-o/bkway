import SearchBar from './SearchBar';
import { TimePicker } from '@mui/x-date-pickers';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { BFSPathfinding } from '../../../../models/pathfinding/bfs';
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

    useUpdateEffect(() => {
        if (!startStop || !endStop)
            return;
        setCompletePath(undefined);
        setPathfinding(new BFSPathfinding(startStop, endStop, Time.of(startTime)));
        setIncompletePaths(pathfinding!.getIncompletePaths());
    }, [startStop, endStop, startTime]);

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
    </>
}
