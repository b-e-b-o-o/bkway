import type { DirectedWeightedEdge } from "../../../../../models/directedWeightedEdge";
import RouteBadge from "../../../common/RouteBadge";
import RouteIcon from "../../../common/RouteIcon";

interface DirectionsCardProps {
    edges: DirectedWeightedEdge[];
}

export default function DirectionsCard({ edges }: DirectionsCardProps) {
    return <>
        <RouteBadge route={edges[0].route} />
        <RouteIcon route={edges[0].route} />
    </>
}