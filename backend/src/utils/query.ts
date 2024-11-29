import { and, between, eq, getTableColumns, gte, inArray, isNull, like, lte, min, not, or, sql } from 'drizzle-orm';

import { getStops } from 'gtfs';
import { getBoundsOfDistance, getDistance } from 'geolib'
import { LocationType, stops } from '../models/db/schema/stops'
import { database } from '../utils/database';
import { stopTimes } from '../models/db/schema/stop-times';
import { trips } from '../models/db/schema/trips';

import type { SubqueryWithSelection } from 'drizzle-orm/sqlite-core';
import { shapes } from '../models/db/schema/shapes';
import { routes } from '../models/db/schema/routes';

export async function searchStops(name: string) {
    const limit = 10;

    // Note that the default locationType is "stop or platform",
    // and those are the only stops that are actually part of at least one route.
    // The others are entrances, etc., we don't want to search for those.

    const startsWith = await database.select()
        .from(stops)
        .where(
            and(
                like(stops.stopName, `${name}%`),
                or(
                    isNull(stops.locationType),
                    eq(stops.locationType, LocationType.STOP),
                )
            )
        )
        .orderBy(stops.stopName)
        .limit(limit);
    const remaining = limit - startsWith.length;
    const contains = await database.select()
        .from(stops)
        .where(
            and(
                like(stops.stopName, `%${name}%`),
                not(like(stops.stopName, `${name}%`)),
                or(
                    isNull(stops.locationType),
                    eq(stops.locationType, LocationType.STOP),
                )
            )
        )
        .orderBy(stops.stopName)
        .limit(remaining);
    const results = [...startsWith, ...contains];
    const stopIds = results.map(stop => stop.stopId);
    const tripIds = database.selectDistinct({ stopId: stopTimes.stopId, tripId: stopTimes.tripId })
        .from(stops)
        .innerJoin(stopTimes, eq(stopTimes.stopId, stops.stopId))
        .where(inArray(stops.stopId, stopIds))
        .as('tripIds');
    const routeIds = database.selectDistinct({ stopId: tripIds.stopId, routeId: trips.routeId })
        .from(trips)
        .innerJoin(tripIds, eq(tripIds.tripId, trips.tripId))
        .as('routeIds');
    const stopRoutes = await database.select({ stopId: routeIds.stopId, routes: routes })
        .from(routes)
        .innerJoin(routeIds, eq(routeIds.routeId, routes.routeId))
        .orderBy(routes.routeType, routes.routeShortName)

    return results.map(stop => {
        return {
            stop: stop,
            routes: stopRoutes.filter(route => route.stopId === stop.stopId).map(route => route.routes)
        }
    });
}

export async function getWalkingNeighbors(stopId: string, distance = 150) {
    const source = getStops({ stop_id: stopId })[0];
    const [bboxLower, bboxUpper] = getBoundsOfDistance(
        { lat: source.stop_lat!, lon: source.stop_lon! },
        distance
    );
    const bbox_stops = await database.select()
        .from(stops)
        .where(
            and(
                between(stops.stopLat, bboxLower.latitude, bboxUpper.latitude),
                between(stops.stopLon, bboxLower.longitude, bboxUpper.longitude),
                isNull(stops.locationType),
                not(eq(stops.stopId, source.stop_id))
            )
    );
    return bbox_stops.filter((stop) => getDistance(
        { lat: source.stop_lat!, lon: source.stop_lon! },
        { lat: stop.stopLat!, lon: stop.stopLon! })
        <= distance);
}

export async function getNeighbors(stopId: string, time: string) {
    const [h, m, s = '0'] = time.split(':');
    const fromTime = (+h * 60 + +m) * 60 + +s; // obviously, 0x1e::0b11101 === 24:00:30
    const toTime = fromTime + 3600; // TODO: don't hardcode this either

    let rides = database.select()
        .from(stopTimes)
        .where(
            and(
                eq(stopTimes.stopId, stopId),
                gte(stopTimes.departureTimestamp, new Date(fromTime * 1000)),
                lte(stopTimes.departureTimestamp, new Date(toTime * 1000))
            )
        )
        .as('rides');

    rides = aliasedColumnsOf(rides);

    const nextStops = database.select()
        .from(stopTimes)
        .innerJoin(
            rides,
            and(
                eq(sql<number>`${rides.stopSequence} + 1`, stopTimes.stopSequence),
                eq(rides.tripId, stopTimes.tripId)
            )
        )
        .groupBy(stopTimes.stopId)
        .having(eq(stopTimes.departureTimestamp, min(stopTimes.departureTimestamp)))
        .as('nextStops');
    const data = await database
        .select({ stop: stops, trip: trips, departureTime: nextStops.rides, arrivalTime: nextStops.stop_times, route: routes })
        .from(nextStops)
        .innerJoin(stops, eq(stops.stopId, nextStops.stop_times.stopId))
        .innerJoin(trips, eq(trips.tripId, nextStops.stop_times.tripId))
        .innerJoin(routes, eq(routes.routeId, trips.routeId));

    return Promise.all(data.map(async (row) => ({
        ...row,
        shape: await database.select({
            shapePtLat: shapes.shapePtLat,
            shapePtLon: shapes.shapePtLon,
        }).from(shapes).where(and(
            eq(shapes.shapeId, row.trip.shapeId!),
            between(shapes.shapeDistTravaled, row.departureTime.shapeDistTraveled!, row.arrivalTime.shapeDistTraveled!)
        ))
    })));
};

// Drizzle can't deal with duplicate column names on self-joins. stupid.
function aliasedColumnsOf<T extends SubqueryWithSelection<any, string>>(table: T, { prefix = '', postfix = '' } = { postfix: '_' }) {
    type SelectedFields = Parameters<typeof database['select']>[0];
    let aliases: SelectedFields = {};
    for (const column in table._.selectedFields) {
        const newName = prefix + column + postfix;
        aliases[column] = sql`${table[column]}`.as(newName);
    }
    // Types aren't perfect but the differences shouldn't have consequences
    return database.select(aliases).from(table).as(table._.alias) as T;
}
