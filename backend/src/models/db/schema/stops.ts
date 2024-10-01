import { sqliteTable, text, real, integer, index, AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { levels } from './others'

enum LocationType {
    STOP = 0,
    STATION = 1,
    ENTRANCE_EXIT = 2,
    GENERIC_NODE = 3,
    BOARDING_AREA = 4
}

enum WheelchairBoarding {
    EMPTY = 0,
    SOME = 1,
    NONE = 2
}

export const stops = sqliteTable('stops', {
    stopId: text('stop_id').primaryKey().notNull(),
    stopCode: text('stop_code'),
    stopName: text('stop_name'),
    ttsStopName: text('tts_stop_name'),
    stopDesc: text('stop_desc'),
    stopLat: real('stop_lat'),
    stopLon: real('stop_lon'),
    zoneId: text('zone_id'),
    stopUrl: text('stop_url'),
    locationType: integer('location_type').$type<LocationType>(),
    parentStation: text('parent_station').references((): AnySQLiteColumn => stops.stopId),
    stopTimezone: text('stop_timezone'),
    wheelchairBoarding: integer('wheelchair_boarding').$type<WheelchairBoarding>(),
    levelId: text('level_id').references(() => levels.levelId),
    platformCode: text('platform_code')
}, (table) => {
    return {
        parentStationIdx: index('idx_stops_parent_station').on(table.parentStation)
    }
});
