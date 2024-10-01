import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './SearchBar.css';
import { FlyToInterpolator, MapViewState } from 'deck.gl';

const BACKEND = import.meta.env.BACKEND ?? 'http://192.168.0.66:3333';

export default function SearchBar({
        placeholder = '',
        setInitialViewState,
    }
    : {
        placeholder: string,
        setInitialViewState: React.Dispatch<React.SetStateAction<MapViewState>>
    }) {
    const [results, setResults] = useState<any[]>([]);
    const input = useRef<HTMLInputElement>(null);

    function flyToStop(result: any) {
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
            <FontAwesomeIcon className='search-icon' icon="magnifying-glass" color='rgb(162, 189, 214)' opacity={0.8} />
            <input type='text' ref={input} onInput={updateResults} placeholder={placeholder} />
        </div>
        <div className='search-results'>
            {
                results.map((result: any, index: number) =>
                    <div key={index} className='search-result'
                        onClick={() => flyToStop(result)}>
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
