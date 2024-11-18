import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Vertex } from '../../../../../models/vertex';
import { Box, Typography } from '@mui/material';
import RouteIcon from '../../../common/RouteIcon';
import RouteBadge from '../../../common/RouteBadge';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { DirectedWeightedEdge } from 'src/models/directedWeightedEdge';
import VerticalDottedLine from './VerticalDottedLine';

export default function TripCard({ vertex }: { vertex: Vertex }) {
    // const [details, setDetails] = useState(<></>);
    const edge = vertex.parentEdge;

    const [expanded, setExpanded] = useState(false);
    const [details, setDetails] = useState<JSX.Element[]>();

    function loadDetails() {
        if (vertex.isRoot) return <></>;
        const groups: DirectedWeightedEdge[][] = [];
        const toRoot = vertex.getVerticesToRoot();
        for (const v of toRoot) {
            const group = groups.at(-1);
            const edge = v.parentEdge;
            const tripId = edge?.trip?.tripId;
            if (tripId && tripId === group?.[0]?.trip?.tripId)
                group.push(edge);
            else if (edge)
                groups.push([edge]);
        }
        console.log(groups);
        return <Box>{
            groups.map((group, i) => <Box key={i}>
                {group[0] && <Box sx={{ display: 'flex', gap: '10px', paddingX: '0.5rem' }}>
                    <RouteIcon stop={group[0].target} size='xsmall' /> <RouteBadge route={group[0].route} size='xsmall' />
                </Box>}
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', padding: '0.5rem' }}>
                    <VerticalDottedLine color={`#${group[0]?.route?.routeColor}`} />
                    <Box>
                        {group.map((edge, j) =>
                            <Box key={j} sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Typography>{edge?.source.stop.stopName}</Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: 'gray' }}>{edge?.source.stop.stopId}</Typography>
                            </Box>)
                        }
                    </Box>
                </Box>
            </Box>)}
            <Box sx={{ paddingX: '0.5rem' }}><RouteIcon stop={toRoot.at(-1)!} size='xsmall' /></Box>
        </Box>;
    }

    useEffect(() => {
        if (!expanded || details !== undefined)
            return;
        setDetails([loadDetails()]);
    }, [expanded]);

    useEffect(() => {
        if (!expanded)
            return;
        setDetails([loadDetails()]);
        return () => setDetails(undefined);
    }, [vertex]);

    return <Accordion onChange={(_, expanded) => setExpanded(expanded)}>
        <AccordionSummary
            expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
            aria-controls={`panel${vertex.id}-content`}
            id={`panel${vertex.id}-header`}
        >
            <Box sx={{ display: 'flex', borderRadius: '10px', gap: '10px', padding: '0.5rem', width: '100%' }}>
                <RouteIcon stop={vertex} />
                {edge && <RouteBadge route={edge.route} />}
                <Typography sx={{ textAlign: 'left' }}>
                    {vertex.stop.stopName}
                </Typography>
                <Box sx={{ fontSize: '0.8rem', color: 'gray', marginLeft: 'auto', height: '100%', textAlign: 'right' }}>
                    {vertex.stop.stopId}
                    <br />
                    {vertex.distance.toString()}
                </Box>
            </Box>
        </AccordionSummary>
        <AccordionDetails>
            {details}
            <Typography align='left'>
            </Typography>
        </AccordionDetails>
    </Accordion>
}
