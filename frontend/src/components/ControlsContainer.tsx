import SearchBar from './SearchBar'
import './ControlsContainer.css'
import { useRoutePlanContext } from '../contexts/routePlan.context';
import { TimePicker } from '@mui/x-date-pickers';
import { Button } from '@mui/material';
import { BFSPathfinding } from '../models/pathfinding/bfs';
import { Pathfinding } from '../models/pathfinding/pathfinding';
import { Vertex } from '../models/vertex';
import { Time } from '../models/time';
import dayjs from 'dayjs';

export default function ControlsContainer() {
    const { startStop, setStartStop, endStop, setEndStop, startTime, setStartTime } = useRoutePlanContext();

    let pathfinding: Pathfinding | null = null;

    function setPathfinding() {
        if (startStop && endStop) {
            const start = Vertex.fromStop(startStop, Time.of(dayjs()));
            pathfinding = new BFSPathfinding(start, endStop.stopId);
        }
    }

    return <div className='controls-container'>
        <div className='menu-container'>
            <SearchBar placeholder='Indulás...' stop={startStop} setStop={(stop) => { setStartStop(stop); setPathfinding(); }} />
            <SearchBar placeholder='Érkezés...' stop={endStop} setStop={(stop) => { setEndStop(stop); setPathfinding(); }} />
            <TimePicker ampm={false} defaultValue={startTime} onChange={(e) => e && setStartTime?.(e)} />
            {
                pathfinding &&
                <Button variant='contained' color='primary' onClick={() => console.log('Next')}>
                    Következő útvonal
                </Button>
            }
        </div>
    </div>
}
