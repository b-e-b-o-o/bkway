import { library } from "@fortawesome/fontawesome-svg-core";
import { faLocationDot, faMagnifyingGlass, faWheelchair } from "@fortawesome/free-solid-svg-icons";

import StopMap from './components/StopMap.tsx'
import ControlsContainer from './components/ControlsContainer.js'
import './App.css'

import { useState } from "react";
import { MapViewState } from "deck.gl";

function App() {

  library.add(faMagnifyingGlass, faWheelchair, faLocationDot);

  const [initialViewState, setInitialViewState] = useState<MapViewState>({
    longitude: 19.046394 - 0.0125,
    latitude: 47.494945,
    zoom: 13.5,
    maxPitch: 0,
    bearing: 0
  });

  return <>
    <ControlsContainer setInitialViewState={setInitialViewState} />
    <StopMap initialViewState={initialViewState} />  
  </>
}

export default App
