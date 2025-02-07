import Map from 'react-map-gl/maplibre'
import { BASEMAP } from '@deck.gl/carto';
import { GeoJsonLayer, PathLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { useViewStateContext } from '../contexts/viewState.context';
import { usePathfindingContext } from '../contexts/pathfinding.context';
import type { Path } from '../types/mapdata';
import { ApiConfig } from '../services/api.service';

const BACKEND = ApiConfig.baseUrl;

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

// const shapesLayer = new GeoJsonLayer({
//   id: 'shapes-layer',
//   data: BACKEND + '/data/shapes.geo.json',
//   pointType: 'circle',
//   getLineColor: (f: any) => {
//     const hex = f.properties.route_color;
//     return hex ? hex.match(/[0-9a-f]{2}/gi).map((x: string) => parseInt(x, 16)) : [0, 0, 0];
//   },
//   getLineWidth: 4,
//   getPointRadius: 6,
//   filled: true
// });

export default function StopMap() {
  const { initialViewState: viewState } = useViewStateContext();

  const { incompletePaths, completePath } = usePathfindingContext();

  const routeLayer = new PathLayer<Path>({
    id: 'route-layer',
    data: completePath ?? incompletePaths,
    getPath: ({ points }) => points.map(p => [p.lon, p.lat] as [number, number]),
    getColor: ({ color }) => color,
    getWidth: 6,
    pickable: true,
  });

  return <DeckGL
    initialViewState={viewState}
    getTooltip={({ object }) => object && (object.name || object.properties.stop_name)}
    layers={[/*shapesLayer,*/ routeLayer, stopsLayer]}
    controller={true}
  >
    <Map mapStyle={BASEMAP.DARK_MATTER} reuseMaps />
  </DeckGL>
}
