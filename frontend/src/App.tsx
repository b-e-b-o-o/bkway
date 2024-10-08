import { useState } from "react";
import { MapViewState } from "deck.gl";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLocationDot, faMagnifyingGlass, faWheelchair } from "@fortawesome/free-solid-svg-icons";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { createTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import 'dayjs/locale/hu';

import { ViewStateContext } from "./contexts/viewState.context.ts";
import { RoutePlanContext } from "./contexts/routePlan.context.ts";
import ControlsContainer from './components/ControlsContainer.js';
import StopMap from './components/StopMap.tsx';

import './App.css'
import { Stop } from './types/Stop';
import { ThemeProvider } from "@emotion/react";

function init() {
  library.add(faMagnifyingGlass, faWheelchair, faLocationDot);
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
      contrastText: '#000000',
      dark: '#000000',
      light: '#000000'
    },
    secondary: {
      main: '#000000',
      contrastText: '#000000',
      dark: '#000000',
      light: '#000000'
    },
    background: {
      default: '#000000',
      paper: '#000000'
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      disabled: '#FFFFFF'
    },
    action: {
      active: '#FFFFFF',
      hover: '#FFFFFF',
      selected: '#FFFFFF',
      disabled: '#FFFFFF',
      disabledBackground: '#FFFFFF',
      focus: '#FFFFFF',
      focusOpacity: 0.12
    }
  }
});


export default function App() {
  init();

  const [startStop, setStartStop] = useState<Stop>();
  const [endStop, setEndStop] = useState<Stop>();
  const [startTime, setStartTime] = useState<Dayjs>(dayjs());
  const routePlan = {
    startStop,
    setStartStop,
    endStop,
    setEndStop,
    startTime,
    setStartTime
  };

  const [initialViewState, setInitialViewState] = useState<MapViewState>({
    longitude: 19.046394 - 0.0125,
    latitude: 47.494945,
    zoom: 13.5,
    maxPitch: 0,
    bearing: 0
  });
  const viewState = {
    initialViewState,
    setInitialViewState
  };

  return <>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RoutePlanContext.Provider value={routePlan}>
          <ViewStateContext.Provider value={viewState}>
            <ControlsContainer />
            <StopMap />
          </ViewStateContext.Provider>
        </RoutePlanContext.Provider>
      </LocalizationProvider>
    </ThemeProvider>
  </>
}
