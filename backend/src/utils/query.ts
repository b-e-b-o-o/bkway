import { and, between, eq, gte, isNull, like, lte, min, not, or, sql } from 'drizzle-orm';

import { getStops } from 'gtfs';
import { getBoundsOfDistance } from 'geolib'
import { LocationType, stops } from '../models/db/schema/stops'
import { database } from '../utils/database';
import { stopTimes } from '../models/db/schema/stop-times';
import { trips } from '../models/db/schema/trips';

import type { SubqueryWithSelection } from 'drizzle-orm/sqlite-core';

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
                    eq(stops.locationType, sql<LocationType>`${+LocationType.STOP}`),
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
                isNull(stops.locationType)
            )
        )
        .orderBy(stops.stopName)
        .limit(remaining);
    return [...startsWith, ...contains];
}

export async function getWalkingNeighbors(stopId: string) {
    const source = getStops({ stop_id: stopId })[0];
    const [bboxLower, bboxUpper] = getBoundsOfDistance(
        { lat: source.stop_lat!, lon: source.stop_lon! },
        150 // TODO: don't hardcode this
    );
    return await database.select()
        .from(stops)
        .where(
            and(
                between(stops.stopLat, bboxLower.latitude, bboxUpper.latitude),
                between(stops.stopLon, bboxLower.longitude, bboxUpper.longitude),
                isNull(stops.locationType)
            )
        )
        .execute();
}

export async function getNeighbors(stopId: string, time: string) {
    // Timestamps don't have to be formatted hh:MM:ss, they get converted back to a number anyway:
    // https://github.com/BlinkTagInc/node-gtfs/blob/90a24f80b8897fc6f0420da351198a8a5f0c98a3/src/lib/utils.ts#L59
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
    const ret = database
        .select({ stop: stops, trip: trips, departureTime: nextStops.rides, arrivalTime: nextStops.stop_times })
        .from(nextStops)
        .innerJoin(stops, eq(stops.stopId, nextStops.stop_times.stopId))
        .innerJoin(trips, eq(trips.tripId, nextStops.stop_times.tripId));

    return await ret.execute();
};

// Drizzle can't deal with duplicate column names on self-joins. stupid.
function aliasedColumnsOf<T extends SubqueryWithSelection<any, string>>(table: T, { prefix = '', postfix = '' } = { postfix: '_' }) {
    type SelectedFields = Parameters<typeof database['select']>[0];
    let aliases: SelectedFields = {};
    for (const column in table._.selectedFields) {
        const newName = prefix + column + postfix;
        aliases[column] = sql`${table[column]}`.as(newName);
    }
    return database.select(aliases).from(table).as(table._.alias) as T;
}
