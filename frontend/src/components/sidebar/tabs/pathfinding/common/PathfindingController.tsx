import { useEffect, useRef, useState } from 'react';
import { Box, Button, Fab } from '@mui/material';
import { usePathfindingContext } from '../../../../../contexts/pathfinding.context';
import InputSlider from '../../../common/InputSlider';
import { faForwardFast, faForwardStep, faPause, faRotateRight, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PathfindingController() {
    const { pathfinding, setIncompletePaths, setCompletePath } = usePathfindingContext();
    const delay = useRef(0.75);
    const go = useRef(false);
    function stop() { go.current = false }
    useEffect(() => { stop(); return stop; }, [pathfinding]);

    async function step() {
        do {
            if (pathfinding === undefined || pathfinding.isFinished) {
                console.log('done');
                go.current = false;
                setCompletePath(pathfinding?.getCompletePath() ?? []);
                break;
            }
            const wait = new Promise((resolve: Function) => setTimeout(resolve, delay.current * 1000));
            await pathfinding.next();
            setIncompletePaths(pathfinding.getIncompletePaths());
            await wait;
        } while (go.current);
    }

    if (!pathfinding) {
        return <></>;
    }

    return <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        {pathfinding.isFinished ?
            <>
                <Fab onClick={async () => { }}>
                    <FontAwesomeIcon icon={faRotateRight} />
                </Fab>
                {/* <Button onClick={() => setPathfinding(new BFSPathfinding(pathfinding.start.stop!, pathfinding.end.stop!, pathfinding.start.time!))} variant="contained"> */}
            </> :
            <>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                    <Fab size='small' onClick={async () => { }}>
                        <FontAwesomeIcon icon={faRotateRight} />
                    </Fab>
                    <Fab color='primary' onClick={async () => await step()} disabled={go.current}>
                        <FontAwesomeIcon size='lg' icon={faForwardStep} />
                    </Fab>
                    <Fab size='small' onClick={async () => { go.current = !go.current; await step(); }}>
                        <FontAwesomeIcon icon={go.current ? faPause : faForwardFast} />
                    </Fab>
                </Box>
                <InputSlider refValue={delay} icon={faStopwatch} min={0} max={2} step={0.05} unit='mp' />
            </>
        }
    </Box>
}
