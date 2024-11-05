import { and, between, eq, gte, inArray, isNull, like, lte, not, SQL, sql } from 'drizzle-orm';

import { advancedQuery, getStops, getStoptimes } from 'gtfs';
import { getBoundsOfDistance, getDistance } from 'geolib'
import { stops } from '../models/db/schema/stops'
import { database } from '../utils/database';
import { stopTimes } from '../models/db/schema/stop-times';
import { trips } from '../models/db/schema/trips';

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
                isNull(stops.locationType)
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
    return await database.select({
        stop: stops,
        trip: sql<null>`SELECT null`.as('trip'),
    })
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

    const from = database.select({
            tripId: stopTimes.tripId,
            nextStopSequence: sql<number>`${stopTimes.stopSequence} + 1`.as('nextStopSequence'),
        })
        .from(stopTimes)
        .where(
            and(
                eq(stopTimes.stopId, stopId),
                gte(stopTimes.departureTimestamp, new Date(fromTime * 1000)),
                lte(stopTimes.departureTimestamp, new Date(toTime * 1000))
            )
        )
        .as('from');
    const nextStops = database.select({
            stopId: stopTimes.stopId,
            tripId: stopTimes.tripId,
        })
        .from(stopTimes)
        .innerJoin(
            from,
            and(
                eq(from.nextStopSequence, stopTimes.stopSequence),
                eq(from.tripId, stopTimes.tripId)
            )
        )
        .as('nextStops');
    return await database
        .select({ stop: stops, trip: trips }) 
        .from(stops)
        .innerJoin(nextStops, eq(stops.stopId, nextStops.stopId))
        .innerJoin(trips, eq(trips.tripId, nextStops.tripId))
        .execute();
}
