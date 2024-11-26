import './App.css';
import 'maplibre-gl/dist/maplibre-gl.css';

import { ThemeProvider } from "@emotion/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { createTheme } from '@mui/material/styles';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { MapViewState } from "deck.gl";
import { useState } from "react";

import type { } from '@mui/x-date-pickers/themeAugmentation';

import Controls from './components/sidebar/Controls.tsx';
import StopMap from './components/StopMap.tsx';
import { PathfindingContext } from "./contexts/pathfinding.context.ts";
import { ViewStateContext } from "./contexts/viewState.context";

import type { Pathfinding } from './models/pathfinding/pathfinding';
import type { Path } from "./types/mapdata";

import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowRightArrowLeft';
import { faBus } from '@fortawesome/free-solid-svg-icons/faBus';
import { faBusSimple } from '@fortawesome/free-solid-svg-icons/faBusSimple';
import { faCableCar } from '@fortawesome/free-solid-svg-icons/faCableCar';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { faElevator } from '@fortawesome/free-solid-svg-icons/faElevator';
import { faFerry } from '@fortawesome/free-solid-svg-icons/faFerry';
import { faForwardFast } from '@fortawesome/free-solid-svg-icons/faForwardFast';
import { faForwardStep } from '@fortawesome/free-solid-svg-icons/faForwardStep';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faPause } from '@fortawesome/free-solid-svg-icons/faPause';
import { faPersonWalking } from '@fortawesome/free-solid-svg-icons/faPersonWalking';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons/faRotateRight';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons/faStopwatch';
import { faTrain } from '@fortawesome/free-solid-svg-icons/faTrain';
import { faTrainSubway } from '@fortawesome/free-solid-svg-icons/faTrainSubway';
import { faTrainTram } from '@fortawesome/free-solid-svg-icons/faTrainTram';
import { faWheelchair } from '@fortawesome/free-solid-svg-icons/faWheelchair';

import 'dayjs/locale/hu';

dayjs.extend(utc);
dayjs.extend(timezone);

function init() {
  library.add(
    faCircleInfo, // tooltip icon
    faArrowRightArrowLeft, // swap button icon
    faChevronDown, // expandable accordion icon
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
  typography: {
    body1: {
      textAlign: 'left'
    },
    body2: {
      fontSize: '0.8rem',
      color: 'gray',
      textAlign: 'left'
    }
  },
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
    action: { // FABs (Floating Action Buttons), Select dropdowns
      active: '#FFFFFF',
      hover: '#0f0728',
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
          '::-webkit-scrollbar': 'none'
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
    MuiFilledInput: {
      styleOverrides: {
        input: {
          paddingTop: '10px'
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
