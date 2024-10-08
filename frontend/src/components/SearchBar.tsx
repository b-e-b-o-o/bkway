import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FlyToInterpolator } from 'deck.gl';
import { Stop } from '../types/Stop';

import { useViewStateContext } from '../contexts/viewState.context';
import './SearchBar.css';

const BACKEND = import.meta.env.BACKEND ?? 'http://127.0.0.1:3333';

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
    const [results, setResults] = useState<Stop[]>([]);
    const input = useRef<HTMLInputElement>(null);

    function flyToStop(result: Stop) {
        setStop(result);
        setInitialViewState({
            longitude: result.stopLon - 0.001,
            latitude: result.stopLat,
            zoom: 17,
            transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
            transitionDuration: 'auto'
        });
        if (!input.current)
            return;
        input.current.value = result.stopName;
        updateResults();
    }

    function updateResults() {
        if (!input.current || input.current.value.length < 2) {
            setResults([]);
            return;
        }
        fetch(`${BACKEND}/search_stops?q=${input.current?.value}`)
            .then(res => res.json())
            .then(data => setResults(data));
    }

    return <div className='search-container'>
        <div className='search-bar'>
            <FontAwesomeIcon className='search-icon' icon="magnifying-glass" color='rgb(140, 160, 190)' />
            <input type='text' ref={input} onInput={updateResults} placeholder={stop?.stopName ?? placeholder} />
        </div>
        <div className='search-results'>
            {
                results.map((result: Stop, index: number) =>
                    <div
                        key={index}
                        tabIndex={-1} // Allow focus (search-container would get hidden on blur before onClick fires, instead we blur manually)
                        className='search-result'
                        onClick={({ target }) => { (target as HTMLDivElement).blur(); flyToStop(result); }}>
                        <div className='location-icon'>
                            <FontAwesomeIcon icon='location-dot' color='#aaf' />
                        </div>
                        {result.stopName}
                        <div className='info-icons'>
                            {
                                (result.wheelchairBoarding == 1) &&
                                <FontAwesomeIcon icon="wheelchair" color='rgb(162, 189, 214)' opacity={0.8} />
                            }
                        </div>
                    </div>
                )
            }
        </div>
    </div>
}
