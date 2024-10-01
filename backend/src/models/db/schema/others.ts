// These schemas were mostly automatically generated using drizzle-kit,
// And aren't actually used in BKK's GTFS.

import { sqliteTable, text, integer, numeric, primaryKey, real } from "drizzle-orm/sqlite-core"
import { agency } from "./agency";

export const areas = sqliteTable("areas", {
    areaId: text("area_id").primaryKey().notNull(),
    areaName: text("area_name"),
});

export const attributions = sqliteTable("attributions", {
    attributionId: text("attribution_id"),
    agencyId: text("agency_id").references(() => agency.agencyId),
    routeId: text("route_id"),
    tripId: text("trip_id"),
    organizationName: text("organization_name").notNull(),
    isProducer: integer("is_producer"),
    isOperator: integer("is_operator"),
    isAuthority: integer("is_authority"),
    attributionUrl: text("attribution_url"),
    attributionEmail: text("attribution_email"),
    attributionPhone: text("attribution_phone"),
});

export const boardAlight = sqliteTable("board_alight", {
    tripId: text("trip_id").notNull(),
    stopId: text("stop_id").notNull(),
    stopSequence: integer("stop_sequence").notNull(),
    recordUse: integer("record_use").notNull(),
    scheduleRelationship: integer("schedule_relationship"),
    boardings: integer("boardings"),
    alightings: integer("alightings"),
    currentLoad: integer("current_load"),
    loadCount: integer("load_count"),
    loadType: integer("load_type"),
    rackDown: integer("rack_down"),
    bikeBoardings: integer("bike_boardings"),
    bikeAlightings: integer("bike_alightings"),
    rampUsed: integer("ramp_used"),
    rampBoardings: integer("ramp_boardings"),
    rampAlightings: integer("ramp_alightings"),
    serviceDate: numeric("service_date"),
    serviceArrivalTime: text("service_arrival_time"),
    serviceArrivalTimestamp: integer("service_arrival_timestamp"),
    serviceDepartureTime: text("service_departure_time"),
    serviceDepartureTimestamp: integer("service_departure_timestamp"),
    source: integer("source"),
});

export const bookingRules = sqliteTable("booking_rules", {
    bookingRuleId: text("booking_rule_id").primaryKey(),
    bookingType: integer("booking_type").notNull(),
    priorNoticeDurationMin: integer("prior_notice_duration_min"),
    priorNoticeDurationMax: integer("prior_notice_duration_max"),
    priorNoticeLastDay: integer("prior_notice_last_day"),
    priorNoticeLastTime: text("prior_notice_last_time"),
    priorNoticeLastTimestamp: integer("prior_notice_last_timestamp"),
    priorNoticeStartDay: integer("prior_notice_start_day"),
    priorNoticeStartTime: text("prior_notice_start_time"),
    priorNoticeStartTimestamp: integer("prior_notice_start_timestamp"),
    priorNoticeServiceId: text("prior_notice_service_id"),
    message: text("message"),
    pickupMessage: text("pickup_message"),
    dropOffMessage: text("drop_off_message"),
    phoneNumber: text("phone_number"),
    infoUrl: text("info_url"),
    bookingUrl: text("booking_url"),
});

export const calendar = sqliteTable("calendar", {
    serviceId: text("service_id").primaryKey().notNull(),
    monday: integer("monday").notNull(),
    tuesday: integer("tuesday").notNull(),
    wednesday: integer("wednesday").notNull(),
    thursday: integer("thursday").notNull(),
    friday: integer("friday").notNull(),
    saturday: integer("saturday").notNull(),
    sunday: integer("sunday").notNull(),
    startDate: numeric("start_date").notNull(),
    endDate: numeric("end_date").notNull(),
});

export const calendarAttributes = sqliteTable("calendar_attributes", {
    serviceId: text("service_id").primaryKey(),
    serviceDescription: text("service_description").notNull(),
});

export const deadheadTimes = sqliteTable("deadhead_times", {
    id: integer("id").primaryKey(),
    deadheadId: text("deadhead_id").notNull(),
    arrivalTime: text("arrival_time").notNull(),
    arrivalTimestamp: integer("arrival_timestamp"),
    departureTime: text("departure_time").notNull(),
    departureTimestamp: integer("departure_timestamp"),
    opsLocationId: text("ops_location_id"),
    stopId: text("stop_id"),
    locationSequence: integer("location_sequence").notNull(),
    shapeDistTraveled: real("shape_dist_traveled"),
});

export const deadheads = sqliteTable("deadheads", {
    deadheadId: text("deadhead_id").primaryKey().notNull(),
    serviceId: text("service_id").notNull(),
    blockId: text("block_id").notNull(),
    shapeId: text("shape_id"),
    toTripId: text("to_trip_id"),
    fromTripId: text("from_trip_id"),
    toDeadheadId: text("to_deadhead_id"),
    fromDeadheadId: text("from_deadhead_id"),
});

export const directions = sqliteTable("directions", {
    routeId: text("route_id").primaryKey().notNull(),
    directionId: integer("direction_id").primaryKey(),
    direction: text("direction").notNull(),
},
(table) => {
    return {
        pk0: primaryKey({ columns: [table.routeId, table.directionId], name: "directions_route_id_direction_id_pk" }),
    }
});

export const fareAttributes = sqliteTable("fare_attributes", {
    fareId: text("fare_id").primaryKey().notNull(),
    price: real("price").notNull(),
    currencyType: text("currency_type").notNull(),
    paymentMethod: integer("payment_method").notNull(),
    transfers: integer("transfers"),
    agencyId: text("agency_id").references(() => agency.agencyId),
    transferDuration: integer("transfer_duration"),
});

export const fareLegRules = sqliteTable("fare_leg_rules", {
    legGroupId: text("leg_group_id"),
    networkId: text("network_id").primaryKey(),
    fromAreaId: text("from_area_id").primaryKey(),
    toAreaId: text("to_area_id").primaryKey(),
    fromTimeframeGroupId: text("from_timeframe_group_id").primaryKey(),
    toTimeframeGroupId: text("to_timeframe_group_id").primaryKey(),
    fareProductId: text("fare_product_id").primaryKey().notNull(),
    rulePriority: integer("rule_priority"),
},
(table) => {
    return {
        pk0: primaryKey({ columns: [table.networkId, table.fromAreaId, table.toAreaId, table.fromTimeframeGroupId, table.toTimeframeGroupId, table.fareProductId], name: "fare_leg_rules_network_id_from_area_id_to_area_id_from_timeframe_group_id_to_timeframe_group_id_fare_product_id_pk" }),
    }
});

export const fareMedia = sqliteTable("fare_media", {
    fareMediaId: text("fare_media_id").primaryKey().notNull(),
    fareMediaName: text("fare_media_name"),
    fareMediaType: integer("fare_media_type").notNull(),
});

export const fareProducts = sqliteTable("fare_products", {
    fareProductId: text("fare_product_id").primaryKey().notNull(),
    fareProductName: text("fare_product_name"),
    fareMediaId: text("fare_media_id").primaryKey(),
    amount: real("amount").notNull(),
    currency: text("currency").notNull(),
},
(table) => {
    return {
        pk0: primaryKey({ columns: [table.fareProductId, table.fareMediaId], name: "fare_products_fare_product_id_fare_media_id_pk" }),
    }
});

export const fareRules = sqliteTable("fare_rules", {
    fareId: text("fare_id").notNull(),
    routeId: text("route_id"),
    originId: text("origin_id"),
    destinationId: text("destination_id"),
    containsId: text("contains_id"),
});

export const fareTransferRules = sqliteTable("fare_transfer_rules", {
    fromLegGroupId: text("from_leg_group_id").primaryKey(),
    toLegGroupId: text("to_leg_group_id").primaryKey(),
    transferCount: integer("transfer_count").primaryKey(),
    transferId: text("transfer_id"),
    durationLimit: integer("duration_limit").primaryKey(),
    durationLimitType: integer("duration_limit_type"),
    fareTransferType: integer("fare_transfer_type").notNull(),
    fareProductId: text("fare_product_id").primaryKey(),
},
(table) => {
    return {
        pk0: primaryKey({ columns: [table.fromLegGroupId, table.toLegGroupId, table.transferCount, table.durationLimit, table.fareProductId], name: "fare_transfer_rules_from_leg_group_id_to_leg_group_id_transfer_count_duration_limit_fare_product_id_pk" }),
    }
});

export const frequencies = sqliteTable("frequencies", {
    tripId: text("trip_id").primaryKey().notNull(),
    startTime: text("start_time").primaryKey().notNull(),
    startTimestamp: integer("start_timestamp"),
    endTime: text("end_time").notNull(),
    endTimestamp: integer("end_timestamp"),
    headwaySecs: integer("headway_secs").notNull(),
    exactTimes: integer("exact_times"),
},
(table) => {
    return {
        pk0: primaryKey({ columns: [table.tripId, table.startTime], name: "frequencies_trip_id_start_time_pk" }),
    }
});

export const levels = sqliteTable("levels", {
    levelId: text("level_id").primaryKey().notNull(),
    levelIndex: real("level_index").notNull(),
    levelName: text("level_name")
});

export const locationGroupStops = sqliteTable("location_group_stops", {
    locationGroupId: text("location_group_id").notNull(),
    stopId: text("stop_id").notNull(),
});

export const locationGroups = sqliteTable("location_groups", {
    locationGroupId: text("location_group_id").primaryKey(),
    locationGroupName: text("location_group_name"),
});

export const locations = sqliteTable("locations", {
    geojson: text("geojson"),
});

export const networks = sqliteTable("networks", {
    networkId: text("network_id").primaryKey().notNull(),
    networkName: text("network_name"),
});

export const opsLocations = sqliteTable("ops_locations", {
    opsLocationId: text("ops_location_id").primaryKey().notNull(),
    opsLocationCode: text("ops_location_code"),
    opsLocationName: text("ops_location_name").notNull(),
    opsLocationDesc: text("ops_location_desc"),
    opsLocationLat: real("ops_location_lat").notNull(),
    opsLocationLon: real("ops_location_lon").notNull(),
});

export const rideFeedInfo = sqliteTable("ride_feed_info", {
    rideFiles: integer("ride_files").notNull(),
    rideStartDate: numeric("ride_start_date"),
    rideEndDate: numeric("ride_end_date"),
    gtfsFeedDate: numeric("gtfs_feed_date"),
    defaultCurrencyType: text("default_currency_type"),
    rideFeedVersion: text("ride_feed_version"),
});

export const riderTrip = sqliteTable("rider_trip", {
    riderId: text("rider_id").primaryKey(),
    agencyId: text("agency_id").references(() => agency.agencyId),
    tripId: text("trip_id"),
    boardingStopId: text("boarding_stop_id"),
    boardingStopSequence: integer("boarding_stop_sequence"),
    alightingStopId: text("alighting_stop_id"),
    alightingStopSequence: integer("alighting_stop_sequence"),
    serviceDate: numeric("service_date"),
    boardingTime: text("boarding_time"),
    boardingTimestamp: integer("boarding_timestamp"),
    alightingTime: text("alighting_time"),
    alightingTimestamp: integer("alighting_timestamp"),
    riderType: integer("rider_type"),
    riderTypeDescription: text("rider_type_description"),
    farePaid: real("fare_paid"),
    transactionType: integer("transaction_type"),
    fareMedia: integer("fare_media"),
    accompanyingDevice: integer("accompanying_device"),
    transferStatus: integer("transfer_status"),
});

export const ridership = sqliteTable("ridership", {
    totalBoardings: integer("total_boardings").notNull(),
    totalAlightings: integer("total_alightings").notNull(),
    ridershipStartDate: numeric("ridership_start_date"),
    ridershipEndDate: numeric("ridership_end_date"),
    ridershipStartTime: text("ridership_start_time"),
    ridershipStartTimestamp: integer("ridership_start_timestamp"),
    ridershipEndTime: text("ridership_end_time"),
    ridershipEndTimestamp: integer("ridership_end_timestamp"),
    serviceId: text("service_id"),
    monday: integer("monday"),
    tuesday: integer("tuesday"),
    wednesday: integer("wednesday"),
    thursday: integer("thursday"),
    friday: integer("friday"),
    saturday: integer("saturday"),
    sunday: integer("sunday"),
    agencyId: text("agency_id").references(() => agency.agencyId),
    routeId: text("route_id"),
    directionId: integer("direction_id"),
    tripId: text("trip_id"),
    stopId: text("stop_id"),
});

export const routeAttributes = sqliteTable("route_attributes", {
    routeId: text("route_id").primaryKey(),
    category: integer("category").notNull(),
    subcategory: integer("subcategory").notNull(),
    runningWay: integer("running_way").notNull(),
});

export const routeNetworks = sqliteTable("route_networks", {
    networkId: text("network_id").notNull(),
    routeId: text("route_id").primaryKey(),
});

export const runEvent = sqliteTable("run_event", {
    runEventId: text("run_event_id").primaryKey().notNull(),
    pieceId: text("piece_id").notNull(),
    eventType: integer("event_type").notNull(),
    eventName: text("event_name"),
    eventTime: text("event_time").notNull(),
    eventDuration: integer("event_duration").notNull(),
    eventFromLocationType: integer("event_from_location_type"),
    eventFromLocationId: text("event_from_location_id"),
    eventToLocationType: integer("event_to_location_type"),
    eventToLocationId: text("event_to_location_id"),
});

export const runsPieces = sqliteTable("runs_pieces", {
    runId: text("run_id").notNull(),
    pieceId: text("piece_id").primaryKey().notNull(),
    startType: integer("start_type").notNull(),
    startTripId: text("start_trip_id").notNull(),
    startTripPosition: integer("start_trip_position"),
    endType: integer("end_type").notNull(),
    endTripId: text("end_trip_id").notNull(),
    endTripPosition: integer("end_trip_position"),
});

export const serviceAlertTargets = sqliteTable("service_alert_targets", {
    alertId: text("alert_id").primaryKey().notNull(),
    stopId: text("stop_id"),
    routeId: text("route_id"),
    createdTimestamp: integer("created_timestamp").notNull(),
    expirationTimestamp: integer("expiration_timestamp").notNull(),
});

export const serviceAlerts = sqliteTable("service_alerts", {
    id: text("id").primaryKey().notNull(),
    cause: integer("cause").notNull(),
    startTime: text("start_time").notNull(),
    endTime: text("end_time").notNull(),
    headline: text("headline").notNull(),
    description: text("description").notNull(),
    createdTimestamp: integer("created_timestamp").notNull(),
    expirationTimestamp: integer("expiration_timestamp").notNull(),
});

export const stopAreas = sqliteTable("stop_areas", {
    areaId: text("area_id").notNull(),
    stopId: text("stop_id").notNull(),
});

export const stopAttributes = sqliteTable("stop_attributes", {
    stopId: text("stop_id").primaryKey().notNull(),
    accessibilityId: integer("accessibility_id"),
    cardinalDirection: text("cardinal_direction"),
    relativePosition: text("relative_position"),
    stopCity: text("stop_city"),
});

export const stopTimeUpdates = sqliteTable("stop_time_updates", {
    tripId: text("trip_id"),
    tripStartTime: text("trip_start_time"),
    directionId: integer("direction_id"),
    routeId: text("route_id"),
    stopId: text("stop_id"),
    stopSequence: integer("stop_sequence"),
    arrivalDelay: integer("arrival_delay"),
    departureDelay: integer("departure_delay"),
    departureTimestamp: text("departure_timestamp"),
    arrivalTimestamp: text("arrival_timestamp"),
    scheduleRelationship: text("schedule_relationship"),
    createdTimestamp: integer("created_timestamp").notNull(),
    expirationTimestamp: integer("expiration_timestamp").notNull(),
});

export const timeframes = sqliteTable("timeframes", {
    timeframeGroupId: text("timeframe_group_id").primaryKey(),
    startTime: text("start_time"),
    endTime: text("end_time"),
    serviceId: text("service_id").notNull(),
});

export const timetableNotes = sqliteTable("timetable_notes", {
    noteId: text("note_id").primaryKey(),
    symbol: text("symbol"),
    note: text("note"),
});

export const timetableNotesReferences = sqliteTable("timetable_notes_references", {
    noteId: text("note_id"),
    timetableId: text("timetable_id"),
    routeId: text("route_id"),
    tripId: text("trip_id"),
    stopId: text("stop_id"),
    stopSequence: integer("stop_sequence"),
    showOnStoptime: integer("show_on_stoptime"),
});

export const timetablePages = sqliteTable("timetable_pages", {
    timetablePageId: text("timetable_page_id").primaryKey(),
    timetablePageLabel: text("timetable_page_label"),
    filename: text("filename"),
});

export const timetableStopOrder = sqliteTable("timetable_stop_order", {
    id: integer("id").primaryKey(),
    timetableId: text("timetable_id"),
    stopId: text("stop_id"),
    stopSequence: integer("stop_sequence"),
});

export const timetables = sqliteTable("timetables", {
    id: integer("id").primaryKey(),
    timetableId: text("timetable_id"),
    routeId: text("route_id"),
    directionId: integer("direction_id"),
    startDate: numeric("start_date"),
    endDate: numeric("end_date"),
    monday: integer("monday").notNull(),
    tuesday: integer("tuesday").notNull(),
    wednesday: integer("wednesday").notNull(),
    thursday: integer("thursday").notNull(),
    friday: integer("friday").notNull(),
    saturday: integer("saturday").notNull(),
    sunday: integer("sunday").notNull(),
    startTime: text("start_time"),
    startTimestamp: integer("start_timestamp"),
    endTime: text("end_time"),
    endTimestamp: integer("end_timestamp"),
    timetableLabel: text("timetable_label"),
    serviceNotes: text("service_notes"),
    orientation: text("orientation"),
    timetablePageId: text("timetable_page_id"),
    timetableSequence: integer("timetable_sequence"),
    directionName: text("direction_name"),
    includeExceptions: integer("include_exceptions"),
    showTripContinuation: integer("show_trip_continuation"),
});

export const transfers = sqliteTable("transfers", {
    fromStopId: text("from_stop_id").primaryKey(),
    toStopId: text("to_stop_id").primaryKey(),
    fromRouteId: text("from_route_id").primaryKey(),
    toRouteId: text("to_route_id").primaryKey(),
    fromTripId: text("from_trip_id").primaryKey(),
    toTripId: text("to_trip_id").primaryKey(),
    transferType: integer("transfer_type"),
    minTransferTime: integer("min_transfer_time"),
},
(table) => {
    return {
        pk0: primaryKey({ columns: [table.fromStopId, table.toStopId, table.fromRouteId, table.toRouteId, table.fromTripId, table.toTripId], name: "transfers_from_stop_id_to_stop_id_from_route_id_to_route_id_from_trip_id_to_trip_id_pk" }),
    }
});

export const translations = sqliteTable("translations", {
    tableName: text("table_name").primaryKey().notNull(),
    fieldName: text("field_name").primaryKey().notNull(),
    language: text("language").primaryKey().notNull(),
    translation: text("translation").notNull(),
    recordId: text("record_id").primaryKey(),
    recordSubId: text("record_sub_id").primaryKey(),
    fieldValue: text("field_value").primaryKey(),
},
(table) => {
    return {
        pk0: primaryKey({ columns: [table.tableName, table.fieldName, table.language, table.recordId, table.recordSubId, table.fieldValue], name: "translations_table_name_field_name_language_record_id_record_sub_id_field_value_pk" }),
    }
});

export const tripCapacity = sqliteTable("trip_capacity", {
    agencyId: text("agency_id").references(() => agency.agencyId),
    tripId: text("trip_id"),
    serviceDate: numeric("service_date"),
    vehicleDescription: text("vehicle_description"),
    seatedCapacity: integer("seated_capacity"),
    standingCapacity: integer("standing_capacity"),
    wheelchairCapacity: integer("wheelchair_capacity"),
    bikeCapacity: integer("bike_capacity"),
});

export const tripUpdates = sqliteTable("trip_updates", {
    updateId: text("update_id").primaryKey().notNull(),
    vehicleId: text("vehicle_id"),
    tripId: text("trip_id"),
    tripStartTime: text("trip_start_time"),
    directionId: integer("direction_id"),
    routeId: text("route_id"),
    startDate: text("start_date"),
    timestamp: text("timestamp"),
    scheduleRelationship: text("schedule_relationship"),
    createdTimestamp: integer("created_timestamp").notNull(),
    expirationTimestamp: integer("expiration_timestamp").notNull(),
});

export const tripsDatedVehicleJourney = sqliteTable("trips_dated_vehicle_journey", {
    tripId: text("trip_id").notNull(),
    operatingDayDate: text("operating_day_date").notNull(),
    datedVehicleJourneyGid: text("dated_vehicle_journey_gid").notNull(),
    journeyNumber: integer("journey_number"),
});

export const vehiclePositions = sqliteTable("vehicle_positions", {
    updateId: text("update_id").primaryKey().notNull(),
    bearing: real("bearing"),
    latitude: real("latitude"),
    longitude: real("longitude"),
    speed: real("speed"),
    currentStopSequence: integer("current_stop_sequence"),
    tripId: text("trip_id"),
    tripStartDate: text("trip_start_date"),
    tripStartTime: text("trip_start_time"),
    congestionLevel: text("congestion_level"),
    occupancyStatus: text("occupancy_status"),
    occupancyPercentage: integer("occupancy_percentage"),
    vehicleStopStatus: text("vehicle_stop_status"),
    vehicleId: text("vehicle_id"),
    vehicleLabel: text("vehicle_label"),
    vehicleLicensePlate: text("vehicle_license_plate"),
    vehicleWheelchairAccessible: text("vehicle_wheelchair_accessible"),
    timestamp: text("timestamp"),
    createdTimestamp: integer("created_timestamp").notNull(),
    expirationTimestamp: integer("expiration_timestamp").notNull(),
});
