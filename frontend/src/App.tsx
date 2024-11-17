import './App.css'

import { useState } from "react";
import { MapViewState } from "deck.gl";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBusSimple, faCableCar, faElevator, faFerry, faBus, faLocationDot, faMagnifyingGlass, faPersonWalking, faTrain, faTrainSubway, faTrainTram, faWheelchair, faStopwatch, faForwardStep, faForwardFast, faPause, faRotateRight } from "@fortawesome/free-solid-svg-icons";
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
  library.add(
    faRotateRight, // restart icon
    faForwardStep, // step button icon
    faForwardFast, // go button icon
    faPause, // go button pause icon
    faStopwatch, // delay slider icon
    faMagnifyingGlass, // search bar
    faWheelchair, // search results mostly
    faLocationDot, // search results
    faTrainTram, // TRAM & BUDAPEST_HÉV route icons
    faTrainSubway, // METRO & CABLE_TRAM route icons
    faTrain, // RAIL & MONORAIL route icons
    faBusSimple, // BUS route icon
    faFerry, // FERRY route icon
    faCableCar, // AERIAL_LIFT route icon
    faElevator, // FUNICULAR route icon
    faBus, // TROLLEYBUS route icon
    faPersonWalking // walking route icon
  );
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
      disabled: '#999999' // Eg. disabled pathfinding tab
    },
    action: { // FABs (Floating Action Buttons)
      active: '#FFFFFF',
      hover: '#aaaaaa',
      selected: '#FFFFFF',
      disabled: '#333333',
      disabledBackground: '#aaaaaa',
      focus: '#FFFFFF',
      focusOpacity: 0.12
    },
  },
  components: {
    MuiMultiSectionDigitalClockSection: {
      styleOverrides: {
        root: {
          scrollbarWidth: 'thin',
          '::-webkitScrollbar': 'none'
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          borderRadius: 0
        }
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          display: 'flex',
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
