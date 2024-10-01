import { drizzle } from 'drizzle-orm/better-sqlite3';
import { stops } from '../models/db/schema/stops'
import { and, isNull, like, not } from 'drizzle-orm';
import { ensureDatabase } from '../utils/database';

const sqlite = await ensureDatabase();
const db = drizzle(sqlite);

export async function searchStops(name: string) {
    const limit = 10;

    // Note that the default locationType is "stop or platform",
    // and those are the only stops that are actually part of at least one route.
    // The others are entrances, etc., we don't want to search for those.

    const startsWith = await db.select()
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
    const contains = await db.select()
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