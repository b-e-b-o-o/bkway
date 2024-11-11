import './TripCard.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Route, StopTime, Trip } from '../../../../../types/gtfs';
import type { Coordinate } from '../../../../../models/coordinate';
import { DirectedWeightedEdge } from '../../../../../models/directedWeightedEdge';
import { Box } from '@mui/material';

export default function TripCard({ edge }: { edge: DirectedWeightedEdge }) {
    return <Box sx={{ display: 'flex', borderRadius: '10px' }}>
        {edge?.source?.stop.stopName} -&gt; {edge?.target?.stop.stopName}
    </Box>
}
