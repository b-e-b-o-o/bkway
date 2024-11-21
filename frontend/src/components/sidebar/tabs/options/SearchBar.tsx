import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FlyToInterpolator } from 'deck.gl';
import { Route, Stop } from '../../../../types/gtfs';
import { searchStops } from '../../../../services/api.service';

import { useViewStateContext } from '../../../../contexts/viewState.context';
import './SearchBar.css';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faWheelchair } from '@fortawesome/free-solid-svg-icons/faWheelchair';
import RouteBadge from '../../common/RouteBadge';
import { CircularProgress } from '@mui/material';

export default function SearchBar({
    placeholder = '',
    stop,
    setStop,
}
    : {
        placeholder: string,
        stop: Stop | undefined,
        setStop: React.Dispatch<React.SetStateAction<Stop | undefined>>,
    }) {
    const { setInitialViewState } = useViewStateContext();
    const [results, setResults] = useState<{ stop: Stop, routes: Route[] }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const abortController = useRef<AbortController | null>(null);
    const input = useRef<HTMLInputElement>(null);

    function flyToStop(stop: Stop) {
        setStop(stop);
        setInitialViewState({
            longitude: stop.stopLon! - 0.001,
            latitude: stop.stopLat!,
            zoom: 17,
            transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
            transitionDuration: 'auto'
        });
        if (!input.current)
            return;
        input.current.value = stop.stopName!;
        updateResults();
    }

    async function updateResults() {
        if (!input.current || input.current.value.length < 2) {
            setResults([]);
            return;
        }
        setIsLoading(true);
        if (abortController.current) {
            abortController.current.abort();
        }
        const controller = new AbortController();
        abortController.current = controller;
        await searchStops(input.current?.value, { signal: controller.signal })
            .then(r => {
                setResults(r);
                setIsLoading(false);
            })
            .catch(e => {
                if (e instanceof DOMException && e.name === 'AbortError')
                    return;
                console.error(e)
            });
        return () => controller.abort();
    }

    useEffect(() => {
        if (!input.current)
            return;
        input.current.value = stop?.stopName ?? '';
        updateResults();
    }, [stop])

    return <div className='search-container'>
        <label className='search-bar flex items-center gap-2'>
            <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} color='rgb(140, 160, 190)' />
            <input
                type="text"
                className="grow w-full h-full"
                placeholder={stop?.stopName ?? placeholder}
                ref={input}
                onInput={updateResults}
            />
        </label>
        {
            results.length > 0 &&
            <div className='search-results'>
                {
                    isLoading ? <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginY: '1rem' }}> <CircularProgress /> </Box> :
                        results.filter(({ routes }) => routes.length > 0).map((result, index) => <div key={index}>
                            <div
                                tabIndex={-1} // Allow focus (search-container would get hidden on blur before onClick fires, instead we blur manually)
                                className='search-result flex flex-row items-center min-h-12 p-2 text-xl cursor-pointer gap-2'
                                onClick={() => { document.querySelector<HTMLElement>(':focus')?.blur?.(); flyToStop(result.stop); }}>
                                <div className='location-icon'>
                                    <FontAwesomeIcon icon={faLocationDot} color='#aaf' />
                                </div>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column', textAlign: 'left', overflowX: 'hidden' }}>
                                    {result.stop.stopName}
                                    <Box sx={{ display: 'flex', gap: '0.25rem', marginY: '3px' }}>
                                        {result.routes.map((route, i) => <RouteBadge key={i} route={route} size='xsmall' />)}
                                    </Box>
                                </Box>
                                {result.stop.wheelchairBoarding == 1 &&
                                    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%', marginLeft: 'auto' }}>
                                        <FontAwesomeIcon icon={faWheelchair} color='rgb(162, 189, 214)' />
                                    </Box>
                                }
                            </div>
                            <Divider />
                        </div>)
                }
            </div>
        }
    </div>
}
