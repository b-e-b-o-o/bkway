import SearchBar from './SearchBar';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';
import { BFSPathfinding } from '../../../../models/pathfinding/algorithms/bfs';
import { DijkstraPathfinding } from '../../../../models/pathfinding/algorithms/dijkstra';
import { GreedyPathfinding } from '../../../../models/pathfinding/algorithms/greedy';
import { AStarPathfinding } from '../../../../models/pathfinding/algorithms/astar';
import { Time } from '../../../../models/time';
import { usePathfindingContext } from '../../../../contexts/pathfinding.context';
import dayjs from 'dayjs';
import type { Stop } from '../../../../types/gtfs';
import { useUpdateEffect } from '../../../../utils/util';
import { PathfindingConfig } from '../../../../models/pathfinding/pathfindingConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowRightArrowLeft';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';

function now() {
    return dayjs().tz('Europe/Budapest').second(0).millisecond(0);
}

const pathfindings = {
    [BFSPathfinding.name]: BFSPathfinding,
    [DijkstraPathfinding.name]: DijkstraPathfinding,
    [GreedyPathfinding.name]: GreedyPathfinding,
    [AStarPathfinding.name]: AStarPathfinding
}

export default function OptionsTab() {
    const { pathfinding, setPathfinding, setIncompletePaths, setCompletePath } = usePathfindingContext();

    const [startStop, setStartStop] = useState<Stop | undefined>(pathfinding?.start.stop);
    const [endStop, setEndStop] = useState<Stop | undefined>(pathfinding?.end.stop);
    const [startTime, setStartTime] = useState(
        pathfinding ? dayjs(1000 * +pathfinding.graph.time).tz("Etc/GMT") : now()
    );
    const [walkingDistance, setWalkingDistance] = useState(PathfindingConfig.walkingDistance);
    const [heuristicWeight, setHeuristicWeight] = useState(PathfindingConfig.heuristicWeight);

    const swapButtonDisabled = !startStop && !endStop;
    const [variant, setVariant] = useState<keyof typeof pathfindings>(pathfinding?.constructor.name as any ?? BFSPathfinding.name);

    useUpdateEffect(() => {
        if (!startStop || !endStop)
            return;
        setPathfinding(new pathfindings[variant](startStop, endStop, Time.of(startTime)));
    }, [startStop, endStop, startTime, variant, walkingDistance, heuristicWeight]);

    // This might as well be moved to App.tsx, but I'd like to keep the logic in the same file
    useUpdateEffect(() => {
        if (pathfinding === undefined)
            return;
        (async () => {
            await pathfinding.nextWalking();
            setIncompletePaths(pathfinding.getIncompletePaths());
            setCompletePath(pathfinding.getCompletePath());
        })();
    }, [pathfinding]);

    return <Box sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', rowGap: '1rem', height: '100%' }}>
        <Divider sx={{ color: '#eee' }} > Útvonal beállításai </Divider>
        <SearchBar placeholder='Indulás...' stop={startStop} setStop={setStartStop} />
        <Box sx={{ position: 'relative', height: 0, width: '100%' }}>
            <Button
                sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: '24px', width: '24px', height: '24px' }}
                onClick={() => { setStartStop(endStop); setEndStop(startStop) }}
                disabled={swapButtonDisabled}>
                <FontAwesomeIcon icon={faArrowRightArrowLeft} color={swapButtonDisabled ? 'gray' : 'white'} width={24} height={24} /*rotation={90}*/ />
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
                sx={{ fontWeight: 'bold' }}
                labelId="algorithm-select-label"
                id="algorithm-select"
                value={variant}
                label="Algoritmus"
                onChange={(v: any) => setVariant(v.target.value)}
            >
                <MenuItem value={BFSPathfinding.name}>BFS</MenuItem>
                <MenuItem value={DijkstraPathfinding.name}>Dijkstra-algoritmus</MenuItem>
                <MenuItem value={GreedyPathfinding.name}>Mohó algoritmus</MenuItem>
                <MenuItem value={AStarPathfinding.name}>A* algoritmus</MenuItem>
            </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', gap: '10px' }}>
            <Box sx={{ display: 'flex', minWidth: 'fit-content', alignSelf: 'center', alignItems: 'center', gap: '0.5rem' }} id="heuristic-weight-helper-text">
                Gyalogos távolság:
                <Tooltip title="Gyalogos átszállás esetén a maximálisan megtett távolság. Figyelem! Ha túl magas, akkor lehet, hogy az útvonaltervezés keresztezi a Dunát. Általában 300m alatt biztonságos.">
                    <FontAwesomeIcon color='#bbbbbb' icon={faCircleInfo} />
                </Tooltip>
            </Box>
            <FilledInput
                id="walking-distance"
                type="number"
                sx={{ maxWidth: '150px' }}
                endAdornment={<InputAdornment position="end">m</InputAdornment>}
                value={walkingDistance}
                aria-describedby="walking-distance-helper-text"
                inputProps={{
                    max: 1000,
                    step: 25
                }}
                onChange={(e) => {
                    const newValue = Number.parseInt(e.target.value, 10);
                    if (newValue && newValue !== PathfindingConfig.walkingDistance) {
                        PathfindingConfig.walkingDistance = newValue;
                        setWalkingDistance(newValue);
                    }
                }}
            />
        </Box>
        {variant === 'astar' &&
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', gap: '10px' }}>
                <Box sx={{ display: 'flex', minWidth: 'fit-content', alignSelf: 'center', alignItems: 'center', gap: '0.5rem' }} id="heuristic-weight-helper-text">
                    Heurisztika súlya:
                    <Tooltip title="A* útkeresés esetén a heurisztikára alkalmazott szorzó">
                        <FontAwesomeIcon color='#bbbbbb' icon={faCircleInfo} />
                    </Tooltip>
                </Box>
                <FilledInput
                    id="heuristic-weight"
                    type="number"
                    sx={{ maxWidth: '150px' }}
                    endAdornment={<InputAdornment position="end">×</InputAdornment>}
                    value={heuristicWeight}
                    inputProps={{
                        step: 0.1
                    }}
                    aria-describedby="heuristic-weight-helper-text"
                    onChange={(e) => {
                        const newValue = Number.parseFloat(e.target.value);
                        if (newValue && newValue !== PathfindingConfig.heuristicWeight) {
                            PathfindingConfig.heuristicWeight = newValue;
                            setHeuristicWeight(newValue);
                        }
                    }}
                />
            </Box>
        }
    </Box>
}
