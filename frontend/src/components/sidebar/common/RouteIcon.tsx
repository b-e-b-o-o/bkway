import { faBusSimple, faCableCar, faElevator, faFerry, faBus, faPersonWalking, faTrain, faTrainSubway, faTrainTram } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouteType } from "../../../types/gtfsCustom.d";
import type { Route } from "../../../types/gtfs";

import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { Avatar } from "@mui/material";

interface RouteIconProps extends Omit<FontAwesomeIconProps, "icon"> {
    route?: Pick<Route, "routeType" | "routeColor" | "routeTextColor">
}

const walkingIcon = faPersonWalking;
const walkingIconColor = '000000';
const walkingBgColor = 'dfdfdf';

const icons = {
    [RouteType.TRAM]: faTrainTram,
    [RouteType.METRO]: faTrainSubway,
    [RouteType.RAIL]: faTrain,
    [RouteType.BUS]: faBusSimple,
    [RouteType.FERRY]: faFerry,
    [RouteType.CABLE_TRAM]: faTrainSubway,
    [RouteType.AERIAL_LIFT]: faCableCar,
    [RouteType.FUNICULAR]: faElevator,
    [RouteType.TROLLEYBUS]: faBus,
    [RouteType.MONORAIL]: faTrain,
    [RouteType.BUDAPEST_HÉV]: faTrainTram,
    undefined: walkingIcon // you can index with undefined if you really want to.
}

export default function RouteIcon(props: RouteIconProps) {
    return <Avatar sx={{ bgcolor: `#${props.route?.routeColor ?? walkingBgColor}`, width: '40px', height: '40px' }} variant="rounded">
        <FontAwesomeIcon {...props} icon={icons[props.route?.routeType!]} color={`#${props.route?.routeTextColor ?? walkingIconColor}`} />
    </Avatar>
}
