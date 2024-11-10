import { useState } from "react";
import { MapViewState } from "deck.gl";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLocationDot, faMagnifyingGlass, faWheelchair } from "@fortawesome/free-solid-svg-icons";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { createTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { Dayjs } from 'dayjs';
import type { } from '@mui/x-date-pickers/themeAugmentation';

import 'dayjs/locale/hu';
dayjs.extend(utc);
dayjs.extend(timezone);

import { ViewStateContext } from "./contexts/viewState.context";
import { RoutePlanContext } from "./contexts/routePlan.context";
import Controls from './components/sidebar/Controls.tsx';
import StopMap from './components/StopMap.tsx';

import './App.css'
import type { Stop } from './types/gtfs';
import { ThemeProvider } from "@emotion/react";
import { Path } from "./types/mapdata";

function init() {
  library.add(faMagnifyingGlass, faWheelchair, faLocationDot);
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a2bdd6', // Most things
      contrastText: '#000000', // Contained button text
      dark: '#FFFFFF', // Contained button hover, time picker clicked time background
      light: '#000000'
    },
    // secondary: {
    //   main: '#eee',
    //   contrastText: '#eee',
    //   dark: '#eee',
    //   light: '#eee'
    // },
    background: {
      paper: '#10003e' // Time picker background
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
    },
  }
});


export default function App() {
  init();

  const [paths, setPaths] = useState<Path[]>([]);
  const [startStop, setStartStop] = useState<Stop>();
  const [endStop, setEndStop] = useState<Stop>();
  const [startTime, setStartTime] = useState<Dayjs>(dayjs().tz('Europe/Budapest'));
  const routePlan = {
    paths,
    setPaths,
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
            <Controls />
            <StopMap />
          </ViewStateContext.Provider>
        </RoutePlanContext.Provider>
      </LocalizationProvider>
    </ThemeProvider>
  </>
}
