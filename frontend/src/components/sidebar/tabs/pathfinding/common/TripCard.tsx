import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Vertex } from '../../../../../models/vertex';
import { Box, Tooltip, Typography } from '@mui/material';
import RouteIcon from '../../../common/RouteIcon';
import RouteBadge from '../../../common/RouteBadge';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { DirectedWeightedEdge } from '../../../../../models/directedWeightedEdge';
import VerticalDottedLine from './VerticalDottedLine';
import { usePathfindingContext } from '../../../../../contexts/pathfinding.context';

export default function TripCard({ vertex }: { vertex: Vertex }) {
    const edge = vertex.parentEdge;

    const { pathfinding } = usePathfindingContext();
    const [expanded, setExpanded] = useState(false);
    const [details, setDetails] = useState<JSX.Element>();

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
        return <Box>
            <Typography gutterBottom variant='body2'>
                <Tooltip
                    title="A gyalogos átszállásokra 2 perc + 1 másodperc/méter van számolva"
                    sx={{ textDecoration: 'underline dotted' }}>
                    <span style={{ "textDecoration": "underline dotted" }}>Távolság az indulóponttól:</span>
                </Tooltip> {vertex.distance.toString({ hours: false })} ({Math.round(+vertex.distance)} mp)
                <br />
                <Tooltip
                    title="A megálló és a célállomás távolsága légvonalban (m)"
                    sx={{ textDecoration: 'underline dotted' }}>
                    <span style={{ "textDecoration": "underline dotted" }}>Heurisztika:</span>
                </Tooltip> {Math.round(vertex.heuristic)}
                <br />
                <Tooltip
                    title="Az utazott megállókba nem számítanak bele azok, ahol csak gyalogolni kell!"
                    sx={{ textDecoration: 'underline dotted' }}>
                    <span style={{ "textDecoration": "underline dotted" }}>Utazott megállók:</span>
                </Tooltip> {vertex.stepsFromRoot}
                <br />
                Összesített súly: {pathfinding && Math.round(pathfinding.getWeight(vertex))}
            </Typography>
            {groups.map((group, i) => <Box key={i}>
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
        setDetails(loadDetails());
    }, [expanded]);

    useEffect(() => {
        if (!expanded)
            return;
        setDetails(loadDetails());
        return () => setDetails(undefined);
    }, [vertex]);

    return <Accordion onChange={(_, expanded) => setExpanded(expanded)}>
        <AccordionSummary
            expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
            aria-controls={`panel${vertex.id}-content`}
            id={`panel${vertex.id}-header`}
        >
            <Box sx={{ display: 'flex', borderRadius: '10px', gap: '10px', paddingX: '0.5rem', width: '100%' }}>
                <RouteIcon stop={vertex} />
                {edge && <RouteBadge route={edge.route} />}
                <Typography sx={{ textAlign: 'left' }}>
                    {vertex.stop.stopName}
                </Typography>
                <Typography variant='body2' sx={{ marginLeft: 'auto', height: '100%', textAlign: 'right' }}>
                    {vertex.stop.stopId}
                    <br />
                    {pathfinding && Math.round(pathfinding.getWeight(vertex))}
                </Typography>
            </Box>
        </AccordionSummary>
        <AccordionDetails>
            {details}
        </AccordionDetails>
    </Accordion>
}
