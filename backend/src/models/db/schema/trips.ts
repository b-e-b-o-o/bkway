import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { routes } from "./routes";
import { calendarDates } from "./calendar-dates";
import { shapes } from "./shapes";

enum WheelchairAccessible {
    NO_INFORMATION = 0,
    YES = 1,
    NO = 2
}

enum BikesAllowed {
    NO_INFORMATION = 0,
    YES = 1,
    NO = 2
}

export const trips = sqliteTable('trips', {
    routeId: text('route_id').references(() => routes.routeId).notNull(),
    serviceId: text('service_id').references(() => calendarDates.serviceId).notNull(),
    tripId: text('trip_id').primaryKey().notNull(),
    tripHeadsign: text('trip_headsign'),
    tripShortName: text('trip_short_name'),
    directionId: integer('direction_id').$type<0 | 1>(),
    blockId: text('block_id'),
    shapeId: text('shape_id').references(() => shapes.shapeId),
    wheelchairAccessible: integer('wheelchair_accessible').$type<WheelchairAccessible>(),
    bikesAllowed: integer('bikes_allowed').$type<BikesAllowed>()
}, (table) => {
    return {
        blockIdIdx: index('idx_trips_block_id').on(table.blockId),
        directionIdIdx: index('idx_trips_direction_id').on(table.directionId),
        routeIdIdx: index('idx_trips_route_id').on(table.routeId),
        serviceIdIdx: index('idx_trips_service_id').on(table.serviceId),
        shapeIdIdx: index('idx_trips_shape_id').on(table.shapeId)
    }
});
