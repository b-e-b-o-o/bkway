import { Vertex } from '../../../../../models/vertex';
import { Box, Paper, Typography } from '@mui/material';
import RouteIcon from '../../../common/RouteIcon';
import RouteBadge from '../../../common/RouteBadge';

export default function TripCard({ vertex }: { vertex: Vertex }) {
    const edge = vertex.parentEdge;
    return <Paper sx={{ display: 'flex', borderRadius: '10px', gap: '10px', padding: '0.5rem' }}>
        <RouteIcon stop={vertex} />
        {edge && <RouteBadge route={edge.route} />}
        <Typography sx={{ textAlign: 'left' }}>
            {vertex.stop.stopName}
        </Typography>
        <Box sx={{ fontSize: '0.8rem', color: 'gray', marginLeft: 'auto' }}>
            {vertex.id}
        </Box>
    </Paper>
}
