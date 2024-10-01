import { GeoJsonLayer } from '@deck.gl/layers';
import { BASEMAP } from '@deck.gl/carto';
import DeckGL from '@deck.gl/react';
import Map from 'react-map-gl/maplibre'
import { MapViewState } from 'deck.gl';

const BACKEND = import.meta.env.BACKEND ?? 'http://127.0.0.1:3333';

const stopsLayer = new GeoJsonLayer({
  id: 'stops-layer',
  data: BACKEND + '/stops.geo.json',
  pointType: 'circle',
  getFillColor: (f: any) => {
    const hex = f.properties.routes[0]?.route_color;
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
  data: BACKEND + '/shapes.geo.json',
  pointType: 'circle',
  getLineColor: (f: any) => {
    const hex = f.properties.route_color;
    return hex ? hex.match(/[0-9a-f]{2}/gi).map((x: string) => parseInt(x, 16)) : [0, 0, 0];
  },
  getLineWidth: 4,
  getPointRadius: 6,
  filled: true
});

export default function StopMap({ initialViewState }: { initialViewState: MapViewState }) {
  return <DeckGL
    initialViewState={initialViewState}
    getTooltip={({ object }) => object && object.properties.stop_name}
    layers={[stopsLayer, shapesLayer]}
    controller={true}
  >
    <Map mapStyle={BASEMAP.DARK_MATTER} reuseMaps />
  </DeckGL>
}
