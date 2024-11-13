import { Vertex } from '../../../../../models/vertex';
import { Paper } from '@mui/material';
import RouteIcon from '../../../common/RouteIcon';
import RouteBadge from '../../../common/RouteBadge';

export default function TripCard({ vertex }: { vertex: Vertex }) {
    const edge = vertex.parentEdge;
    return <Paper sx={{ display: 'flex', borderRadius: '10px', gap: '10px', padding: '0.5rem' }}>
        {edge && <RouteIcon route={edge.route} />}
        {edge && <RouteBadge route={edge.route} />}
        {vertex.parentVertex?.stop.stopName} -&gt; {vertex.stop.stopName}
    </Paper>
}
