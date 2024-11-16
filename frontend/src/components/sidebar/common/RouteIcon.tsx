import { faBusSimple, faCableCar, faElevator, faFerry, faBus, faPersonWalking, faTrain, faTrainSubway, faTrainTram, faLocationDot, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@mui/material";
import { RouteType } from "../../../types/gtfsCustom.d";

import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import type { Vertex } from "src/models/vertex";
import React from "react";

interface RouteIconProps extends Omit<FontAwesomeIconProps, "icon"> {
    stop: Vertex;
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
    [RouteType.TROLLEYBUS]: faBus,
    [RouteType.MONORAIL]: faTrain,
    [RouteType.BUDAPEST_HÉV]: faTrainTram,
    'WALKING': faPersonWalking,
    'SOURCE': faLocationDot,
}

export default function RouteIcon({ stop, ...props }: RouteIconProps) {
    const edge = stop.parentEdge;
    let color: string;
    let bgcolor: string;
    let icon: IconDefinition;
    const border = {} as React.CSSProperties;
    if (edge) {
        if (edge.route) {
            color = `#${edge.route.routeTextColor}`;
            bgcolor = `#${edge.route.routeColor!}`;
            icon = icons[edge.route.routeType];
        }
        else {
            // Walking
            color = '#000000';
            bgcolor = '#dfdfdf';
            icon = icons['WALKING'];
        }
    }
    else {
        // Source
        color = '#dfdfdf';
        bgcolor = '#101010';
        icon = icons['SOURCE'];
        border.borderColor = '#dfdfdf';
        border.borderWidth = '1px';
    }
    return <Avatar sx={{ ...border, bgcolor, width: '40px', height: '40px' }} variant="rounded">
        <FontAwesomeIcon {...props} icon={icon} color={color} />
    </Avatar>
}
