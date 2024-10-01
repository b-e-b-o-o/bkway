import SearchBar from './SearchBar'
import './ControlsContainer.css'
import { MapViewState } from 'deck.gl'

export default function ControlsContainer({ setInitialViewState }: { setInitialViewState: React.Dispatch<React.SetStateAction<MapViewState>> }) {   
    return <div className='controls-container'>
        <div className='menu-container'>
            <SearchBar setInitialViewState={setInitialViewState} placeholder='Indulás...' />
            <SearchBar setInitialViewState={setInitialViewState} placeholder='Érkezés...' />
        </div>
    </div>
}
