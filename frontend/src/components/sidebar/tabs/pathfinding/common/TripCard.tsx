import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Route, StopTime, Trip } from '../../../../../types/gtfs';
import type { Coordinate } from '../../../../../models/coordinate';
import { DirectedWeightedEdge } from '../../../../../models/directedWeightedEdge';
import { Vertex } from '../../../../../models/vertex';
import { Box, Paper } from '@mui/material';
import RouteIcon from '../../../common/RouteIcon';

export default function TripCard({ vertex }: { vertex: Vertex }) {
    return <Paper sx={{ display: 'flex', borderRadius: '10px', gap: '10px', padding: '0.5rem' }}>
        {vertex.parentEdge && <RouteIcon route={vertex.parentEdge.route} />}
        {vertex.parentVertex?.stop.stopName} -&gt; {vertex.stop.stopName}
    </Paper>
}
