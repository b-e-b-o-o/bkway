import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { agency } from './agency'

enum RouteType {
    TRAM = 0,
    METRO = 1,
    RAIL = 2,
    BUS = 3,
    FERRY = 4,
    CABLE_TRAM = 5,
    AERIAL_LIFT = 6,
    FUNICULAR = 7,
    TROLLEYBUS = 11,
    MONORAIL = 12
}

enum ContinuousPickupDropOff {
    YES = 0,
    NO = 1,
    PHONE_AGENCY = 2,
    ASK_DRIVER = 3
}

export const routes = sqliteTable('routes', {
    routeId: text('route_id').primaryKey().notNull(),
    agencyId: text('agency_id').references(() => agency.agencyId),
    routeShortName: text('route_short_name'),
    routeLongName: text('route_long_name'),
    routeDesc: text('route_desc'),
    routeType: integer('route_type').$type<RouteType>().notNull(),
    routeUrl: text('route_url'),
    routeColor: text('route_color'),
    routeTextColor: text('route_text_color'),
    routeSortOrder: integer('route_sort_order'),
    continuousPickup: integer('continuous_pickup').$type<ContinuousPickupDropOff>(),
    continuousDropoff: integer('continuous_drop_off').$type<ContinuousPickupDropOff>(),
    networkId: text('network_id')
});
