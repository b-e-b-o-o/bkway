import { sqliteTable, text, real, integer, index, primaryKey } from "drizzle-orm/sqlite-core";
import { bookingRules } from "./others";
import { stops } from "./stops";
import { trips } from "./trips";

enum PickupDropOffType {
    SCHEDULED = 0,
    NONE = 1,
    PHONE_AGENCY = 2,
    ASK_DRIVER = 3
}

enum ContinuousPickupDropOff {
    YES = 0,
    NO = 1,
    PHONE_AGENCY = 2,
    ASK_DRIVER = 3
}

enum Timepoint {
    APPROXIMATE = 0,
    EXACT = 1
}

export const stopTimes = sqliteTable('stop_times', {
    tripId: text('trip_id').references(() => trips.tripId),
    arrivalTime: text('arrival_time'),
    arrivalTimestamp: integer('arrival_timestamp', { mode: 'timestamp' }), // not part of GTFS specs, added by node-gtfs
    departureTime: text('departure_time'),
    departureTimestamp: integer('departure_timestamp', { mode: 'timestamp' }), // not part of GTFS specs, added by node-gtfs
    locationGroupId: text('location_group_id'),
    locationId: text('location_id'),
    stopId: text('stop_id').references(() => stops.stopId).notNull(),
    stopSequence: integer('stop_sequence').notNull(),
    stopHeadsign: text('stop_headsign'),
    startPickUpDropOffWindow: text('start_pickup_drop_off_window'),
    startPickUpDropOffWindowTimestamp: integer('start_pickup_drop_off_window_timestamp', { mode: 'timestamp' }), // not part of GTFS specs, added by node-gtfs
    // endPickUpDropOffWindow: text('end_pickup_drop_off_window'), // part of GTFS specs, but not used by node-gtfs
    pickupType: integer('pickup_type').$type<PickupDropOffType>(),
    dropOffType: integer('drop_off_type').$type<PickupDropOffType>(),
    continuousPickup: integer('continuous_pickup').$type<ContinuousPickupDropOff>(),
    continuousDropOff: integer('continuous_drop_off').$type<ContinuousPickupDropOff>(),
    shapeDistTraveled: real('shape_dist_traveled'),
    timepoint: integer('timepoint').$type<Timepoint>(),
    pickupBookingRuleId: text('pickup_booking_rule_id').references(() => bookingRules.bookingRuleId),
    dropOffBookingRuleId: text('drop_off_booking_rule_id').references(() => bookingRules.bookingRuleId),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.tripId, table.stopSequence] }),
        arrivalTimestampIdx: index('idx_stop_times_arrival_timestamp').on(table.arrivalTimestamp),
        departureTimestampIdx: index('idx_stop_times_departure_timestamp').on(table.departureTimestamp),
        dropOffBookingRuleIdIdx: index('idx_stop_times_drop_off_booking_rule_id').on(table.dropOffBookingRuleId),
        locationGroupIdIdx: index('idx_stop_times_location_group_id').on(table.locationGroupId),
        locationIdIdx: index('idx_stop_times_location_id').on(table.locationId),
        pickupBookingRuleIdIdx: index('idx_stop_times_pickup_booking_rule_id').on(table.pickupBookingRuleId),
        startPickUpDropOffWindowTimestampIdx: index('idx_stop_times_start_pickup_drop_off_window_timestamp').on(table.startPickUpDropOffWindowTimestamp),
        stopIdIdx: index('idx_stop_times_stop_id').on(table.stopId)
    }
});
