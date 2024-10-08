import SearchBar from './SearchBar'
import './ControlsContainer.css'
import { useRoutePlanContext } from '../contexts/routePlan.context';
import { TimePicker } from '@mui/x-date-pickers';

export default function ControlsContainer() {
    const { startStop, setStartStop, endStop, setEndStop, startTime, setStartTime } = useRoutePlanContext(); 

    return <div className='controls-container'>
        <div className='menu-container'>
            <SearchBar placeholder='Indulás...' stop={startStop} setStop={setStartStop} />
            <SearchBar placeholder='Érkezés...' stop={endStop} setStop={setEndStop} />
            <TimePicker ampm={false} defaultValue={startTime} onChange={(e) => e && setStartTime?.(e)} />
        </div>
    </div>
}
