import type { Route } from "../../../types/gtfs";
import { Avatar } from "@mui/material";

interface RouteBadgeProps {
    route?: Pick<Route, "routeColor" | "routeTextColor" | "routeShortName">
}

const walkingIconColor = '000000';
const walkingBgColor = 'dfdfdf';

export default function RouteBadge({ route }: RouteBadgeProps) {
    if (!route)
        return <></>;
    const bgColor = route.routeColor ?? walkingBgColor;
    const textColor = route.routeTextColor ?? walkingIconColor;
    return <Avatar sx={{ bgcolor: `#${bgColor}`, color: `#${textColor}`, fontWeight: 'bold' }}>
        {route.routeShortName}
    </Avatar>
}
