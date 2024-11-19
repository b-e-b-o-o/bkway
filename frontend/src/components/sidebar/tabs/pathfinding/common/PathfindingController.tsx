import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { usePathfindingContext } from '../../../../../contexts/pathfinding.context';
import InputSlider from '../../../common/InputSlider';
import { faForwardFast } from '@fortawesome/free-solid-svg-icons/faForwardFast';
import { faForwardStep } from '@fortawesome/free-solid-svg-icons/faForwardStep';
import { faPause } from '@fortawesome/free-solid-svg-icons/faPause';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons/faRotateRight';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons/faStopwatch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PathfindingController() {
    const { pathfinding, setIncompletePaths, setCompletePath } = usePathfindingContext();
    const [stepping, setStepping] = useState(false);
    const delay = useRef(0.75);
    const go = useRef(false);
    function stopStepping() { go.current = false }
    useEffect(() => { stopStepping(); return stopStepping; }, [pathfinding]);

    if (!pathfinding) {
        return <></>;
    }

    const reset = async () => {
        stopStepping();
        setStepping(false);
        pathfinding.reset();
        await pathfinding.nextWalking();
        setIncompletePaths(pathfinding.getIncompletePaths());
        setCompletePath(pathfinding.getCompletePath());
    }

    async function step() {
        do {
            if (stepping)
                return;
            setStepping(true);
            if (pathfinding === undefined || pathfinding.isFinished) {
                console.log('done');
                stopStepping();
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
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }} title='Újrakezdés'>
                    <Fab size='small' onClick={reset} disabled={go.current}>
                        <FontAwesomeIcon icon={faRotateRight} />
                    </Fab>
                    <Fab color='primary' onClick={async () => { go.current = !go.current; await step(); }} title={go.current ? 'Leállítás' : 'Indítás'} >
                        <FontAwesomeIcon icon={go.current ? faPause : faForwardFast} />
                    </Fab>
                    <Fab size='small' onClick={step} disabled={go.current || stepping} title='Következő lépés'>
                        <FontAwesomeIcon size='lg' icon={faForwardStep} />
                    </Fab>
                </Box>
                <InputSlider refValue={delay} icon={faStopwatch} min={0} max={2} step={0.05} unit='mp' title='Várakozás lépések között' />
            </>
        }
    </Box>
}
