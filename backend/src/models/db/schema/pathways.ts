import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { stops } from './stops'

enum PathwayMode {
    WALKWAY = 1,
    STAIRS = 2,
    MOVING_SIDEWALK = 3,
    ESCALATOR = 4,
    ELEVATOR = 5,
    FARE_GATE = 6,
    EXIT_GATE = 7
}

export const pathways = sqliteTable('pathways', {
    pathwayId: text('pathway_id').primaryKey().notNull(),
    fromStopId: text('from_stop_id').notNull().references(() => stops.stopId),
    toStopId: text('to_stop_id').notNull().references(() => stops.stopId),
    pathwayMode: integer('pathway_mode').$type<PathwayMode>().notNull(),
    isBidirectional: integer('is_bidirectional', { mode: 'boolean' }).notNull(),
    length: real('length'),
    traversalTime: integer('traversal_time'),
    stairCount: integer('stair_count'),
    maxSlope: real('max_slope'),
    minWidth: real('min_width'),
    signpostedAs: text('signposted_as'),
    reversedSignpostedAs: text('reversed_signposted_as')
});
