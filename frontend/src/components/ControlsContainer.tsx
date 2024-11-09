import SearchBar from './SearchBar'
import './ControlsContainer.css'
import { useRoutePlanContext } from '../contexts/routePlan.context';
import { TimePicker } from '@mui/x-date-pickers';
import { Button } from '@mui/material';
import { BFSPathfinding } from '../models/pathfinding/bfs';
import { Vertex } from '../models/vertex';
import { Time } from '../models/time';
import { useViewStateContext } from '../contexts/viewState.context';
import { FlyToInterpolator } from 'deck.gl';
import { useMemo } from 'react';


export default function ControlsContainer() {
    const { startStop, setStartStop, endStop, setEndStop, startTime, setStartTime } = useRoutePlanContext();
    const { setInitialViewState } = useViewStateContext();

    const pathfinding = useMemo(() => startStop && endStop && new BFSPathfinding(Vertex.fromStop(startStop, Time.of(startTime)), endStop.stopId), [startStop, endStop, startTime]);

    return <div className='controls-container'>
        <div className='menu-container'>
            <SearchBar placeholder='Indulás...' stop={startStop} setStop={setStartStop} />
            <SearchBar placeholder='Érkezés...' stop={endStop} setStop={setEndStop} />
            <TimePicker ampm={false} defaultValue={startTime} onChange={(e) => e && setStartTime?.(e)} />
            <Button color='secondary' onClick={() => pathfinding?.next().then(res => {
                console.log(res);
                setInitialViewState({
                    latitude: res[0].location.lat! - 0.001,
                    longitude: res[0].location.lon! - 0.001,
                    zoom: 17,
                    transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
                    transitionDuration: 'auto'
                })
            })}>
                Következő útvonal
            </Button>
        </div>
    </div>
}
