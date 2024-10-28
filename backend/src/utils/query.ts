import { and, isNull, like, not } from 'drizzle-orm';

import { stops } from '../models/db/schema/stops'
import { database } from '../utils/database';
import { advancedQuery } from 'gtfs';

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

// TODO test this
export function advanced(name: string) {
    return advancedQuery('stops', {
        query: {
            'stops.stopName': `%${name}%`,
        },
        fields: ['stops.stopName']
    });
}
