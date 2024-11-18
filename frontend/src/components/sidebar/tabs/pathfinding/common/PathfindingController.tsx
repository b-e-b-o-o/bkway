import { useEffect, useRef, useState } from 'react';
import { Box, Fab } from '@mui/material';
import { usePathfindingContext } from '../../../../../contexts/pathfinding.context';
import InputSlider from '../../../common/InputSlider';
import { faForwardFast, faForwardStep, faPause, faRotateRight, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PathfindingController() {
    const { pathfinding, setIncompletePaths, setCompletePath } = usePathfindingContext();
    const [stepping, setStepping] = useState(false);
    const delay = useRef(0.75);
    const go = useRef(false);
    function stop() { go.current = false }
    useEffect(() => { stop(); return stop; }, [pathfinding]);

    if (!pathfinding) {
        return <></>;
    }

    const reset = async () => {
        go.current = false;
        setStepping(false);
        pathfinding.reset();
        await pathfinding.nextWalking();
        setIncompletePaths(pathfinding.getIncompletePaths());
        setCompletePath(undefined);
    }

    async function step() {
        do {
            if (stepping)
                return;
            setStepping(true);
            if (pathfinding === undefined || pathfinding.isFinished) {
                console.log('done');
                go.current = false;
                setCompletePath(pathfinding?.getCompletePath());
                break;
            }
            const wait = new Promise((resolve: Function) => setTimeout(resolve, delay.current * 1000));
            await pathfinding.next();
            setIncompletePaths(pathfinding.getIncompletePaths());
            await wait;
            setStepping(false);
        } while (go.current || pathfinding.isFinished);
    }

    return <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        {pathfinding.isFinished ?
            <>
                <Fab onClick={reset}>
                    <FontAwesomeIcon icon={faRotateRight} />
                </Fab>
            </> :
            <>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                    <Fab size='small' onClick={reset} disabled={go.current}>
                        <FontAwesomeIcon icon={faRotateRight} />
                    </Fab>
                    <Fab color='primary' onClick={async () => { go.current = !go.current; await step(); }}>
                        <FontAwesomeIcon icon={go.current ? faPause : faForwardFast} />
                    </Fab>
                    <Fab size='small' onClick={step} disabled={go.current || stepping}>
                        <FontAwesomeIcon size='lg' icon={faForwardStep} />
                    </Fab>
                </Box>
                <InputSlider refValue={delay} icon={faStopwatch} min={0} max={2} step={0.05} unit='mp' />
            </>
        }
    </Box>
}
