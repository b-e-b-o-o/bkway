import SearchBar from './SearchBar'
import './ControlsContainer.css'
import { useRoutePlanContext } from '../contexts/routePlan.context';
import { TimePicker } from '@mui/x-date-pickers';
import { Button } from '@mui/material';
import { BFSPathfinding } from '../models/pathfinding/bfs';
import { Time } from '../models/time';
import { useMemo } from 'react';
import { Graph } from '../models/graph';


export default function ControlsContainer() {
    const { paths, setPaths, startStop, setStartStop, endStop, setEndStop, startTime, setStartTime } = useRoutePlanContext();

    const pathfinding = useMemo(() => {
        if (!startStop || !endStop)
            return;
        const graph = new Graph(Time.of(startTime), startStop);
        const startVertex = graph.getOrAddVertex(startStop.stopId, startStop);
        return startStop && endStop && new BFSPathfinding(startVertex, endStop.stopId)
    }, [startStop, endStop, startTime]);

    return <div className='controls-container'>
        <div className='menu-container'>
            <SearchBar placeholder='Indulás...' stop={startStop} setStop={setStartStop} />
            <SearchBar placeholder='Érkezés...' stop={endStop} setStop={setEndStop} />
            <TimePicker ampm={false} defaultValue={startTime} onChange={(e) => e && setStartTime?.(e)} />
            <Button color='secondary' onClick={() => pathfinding?.next().then(res => {
                setPaths(pathfinding.getUnfinishedPaths().map(p => ({
                    path: p.map(c => [c.lon, c.lat]),
                    name: 'út',
                    color: [255, 0, 0] as [number, number, number]
                })));
                const maxPathLen = Math.max(...paths.map(p => p.path.length));
                console.log(paths.filter(p => p.path.length === maxPathLen));
            })}>
                Következő útvonal
            </Button>
        </div>
    </div>
}
