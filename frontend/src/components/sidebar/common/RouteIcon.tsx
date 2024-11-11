import { faBusSimple, faCableCar, faElevator, faFerry, faHorse, faPersonWalking, faTrain, faTrainSubway, faTrainTram } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouteType } from "../../../types/gtfsCustom.d";
import type { Route } from "../../../types/gtfs";

import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

interface RouteIconProps extends Omit<FontAwesomeIconProps, "icon"> {
    route: Pick<Route, "routeType" | "routeColor">
}

const icons = {
    [RouteType.TRAM]: faTrainTram,
    [RouteType.METRO]: faTrainSubway,
    [RouteType.RAIL]: faTrain,
    [RouteType.BUS]: faBusSimple,
    [RouteType.FERRY]: faFerry,
    [RouteType.CABLE_TRAM]: faTrainSubway,
    [RouteType.AERIAL_LIFT]: faCableCar,
    [RouteType.FUNICULAR]: faElevator,
    [RouteType.TROLLEYBUS]: faHorse,
    [RouteType.MONORAIL]: faTrain,
    [RouteType.BUDAPEST_HÉV]: faTrainTram,
    undefined: faPersonWalking
}

export default function RouteIcon(props: RouteIconProps) {
    return <FontAwesomeIcon {...props} icon={icons[props.route.routeType]} color={`#${props.route.routeColor}`} />
}
