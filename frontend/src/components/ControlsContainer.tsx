import SearchBar from './SearchBar'
import './ControlsContainer.css'
import { useRoutePlanContext } from '../contexts/routePlan.context';
import { TimePicker } from '@mui/x-date-pickers';
import { Button } from '@mui/material';
import { BFSPathfinding } from '../models/pathfinding/bfs';
import { Time } from '../models/time';
import { useMemo, useRef } from 'react';
import { Graph } from '../models/graph';


export default function ControlsContainer() {
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

    return <div className='controls-container'>
        <div className='menu-container'>
            <SearchBar placeholder='Indulás...' stop={startStop} setStop={setStartStop} />
            <SearchBar placeholder='Érkezés...' stop={endStop} setStop={setEndStop} />
            <TimePicker ampm={false} defaultValue={startTime} onChange={(e) => e && setStartTime?.(e)} />
            <Button color='secondary' onClick={step}>
                Következő lépés
            </Button>
            <Button color='secondary' onClick={async () => { go.current = !go.current; await step(); }}>
                lépkedés {go.current ? 'stop' : 'go'}
            </Button>
        </div>
    </div>
}
