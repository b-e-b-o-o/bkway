import './App.css'

import { useState } from "react";
import { MapViewState } from "deck.gl";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLocationDot, faMagnifyingGlass, faWheelchair } from "@fortawesome/free-solid-svg-icons";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { createTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider } from "@emotion/react";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import type { } from '@mui/x-date-pickers/themeAugmentation';

import Controls from './components/sidebar/Controls.tsx';
import StopMap from './components/StopMap.tsx';
import { ViewStateContext } from "./contexts/viewState.context";
import { PathfindingContext } from "./contexts/pathfinding.context.ts";

import type { Path } from "./types/mapdata";
import type { Pathfinding } from './models/pathfinding/pathfinding';

import 'dayjs/locale/hu';
dayjs.extend(utc);
dayjs.extend(timezone);

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
  },
  components: {
    MuiMultiSectionDigitalClockSection: {
      styleOverrides: {
        root: {
          scrollbarWidth: 'thin',
          '::-webkit-scrollbar': 'none'
        }
      }
    }
  }
});

export default function App() {
  init();

  const [pathfinding, setPathfinding] = useState<Pathfinding>();
  const [incompletePaths, setIncompletePaths] = useState<Path[]>([]);
  const [completePath, setCompletePath] = useState<Path[]>();

  const pathfindingState = {
    pathfinding,
    setPathfinding,
    incompletePaths,
    setIncompletePaths,
    completePath,
    setCompletePath
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
        <PathfindingContext.Provider value={pathfindingState}>
          <ViewStateContext.Provider value={viewState}>
            <Controls />
            <StopMap />
          </ViewStateContext.Provider>
        </PathfindingContext.Provider>
      </LocalizationProvider>
    </ThemeProvider>
  </>
}
