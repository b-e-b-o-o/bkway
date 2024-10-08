import Map from 'react-map-gl/maplibre'
import { BASEMAP } from '@deck.gl/carto';
import { GeoJsonLayer, PathLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { useViewStateContext } from '../contexts/viewState.context';
import { useRoutePlanContext } from '../contexts/routePlan.context';

const BACKEND = import.meta.env.BACKEND ?? 'http://127.0.0.1:3333';

const stopsLayer = new GeoJsonLayer({
  id: 'stops-layer',
  data: BACKEND + '/data/stops.geo.json',
  pointType: 'circle',
  getFillColor: (f: any) => {
    // node-gtfs guarantees that only stops with at least one route are included in the geojson
    const hex = f.properties.routes[0].route_color;
    return hex ? hex.match(/[0-9a-f]{2}/gi).map((x: string) => parseInt(x, 16)) : [0, 0, 0];
  },
  getLineWidth: 1,
  getPointRadius: 6,
  getText: (f: any) => f.properties.stop_name,
  getTextSize: 14,
  getTextPixelOffset: [0, -15],
  textFontFamily: "Arial",
  textCharacterSet: "auto",
  pickable: true,
  filled: true
});

const shapesLayer = new GeoJsonLayer({
  id: 'shapes-layer',
  data: BACKEND + '/data/shapes.geo.json',
  pointType: 'circle',
  getLineColor: (f: any) => {
    const hex = f.properties.route_color;
    return hex ? hex.match(/[0-9a-f]{2}/gi).map((x: string) => parseInt(x, 16)) : [0, 0, 0];
  },
  getLineWidth: 4,
  getPointRadius: 6,
  filled: true
});

export default function StopMap() {
  const { initialViewState: viewState } = useViewStateContext();

  const { startStop, endStop } = useRoutePlanContext();

  const PATH_DATA = [
    {
      path: [[startStop?.stopLon, startStop?.stopLat], [endStop?.stopLon, endStop?.stopLat] /*, ... */ ],
      name: 'Richmond - Millbrae',
      color: [255, 0, 0]
    },
    // ...
  ];

  const routeLayer = new PathLayer<{ path: [number, number][], name: string, color: [number, number, number] }>({
    id: 'route-layer',
    data: PATH_DATA,
    getPath: ({ path }) => path,
    getColor: ({ color }) => color,
    getWidth: 4,
    pickable: true,
  });

  return <DeckGL
    initialViewState={viewState}
    getTooltip={({ object }) => object && object.name}
    layers={[stopsLayer, shapesLayer, routeLayer]}
    controller={true}
  >
    <Map mapStyle={BASEMAP.DARK_MATTER} reuseMaps />
  </DeckGL>
}
