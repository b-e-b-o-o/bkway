import { Avatar } from "@mui/material";
import { avatarSize, fontSize } from "../../../utils/sizes";
import type { Size } from "../../../types/misc";
import type { Route } from "../../../types/gtfs";

interface RouteBadgeProps {
    route?: Pick<Route, "routeColor" | "routeTextColor" | "routeShortName">
    size?: Size
}

const walkingIconColor = '000000';
const walkingBgColor = 'dfdfdf';

export default function RouteBadge({ route, size = 'medium' }: RouteBadgeProps) {
    if (!route)
        return <></>;
    const bgColor = route.routeColor ?? walkingBgColor;
    const textColor = route.routeTextColor ?? walkingIconColor;
    return <Avatar sx={{ bgcolor: `#${bgColor}`, color: `#${textColor}`, fontWeight: 'bold', fontSize: fontSize(size), width: avatarSize(size), height: avatarSize(size) }} variant="rounded">
        {route.routeShortName}
    </Avatar>
}
