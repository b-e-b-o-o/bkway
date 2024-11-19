import fs from 'fs/promises';
import Database, { SqliteError } from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { getStopsAsGeoJSON, importGtfs } from "gtfs";
import config from '../configs/gtfs.config';
import { stopTimes } from "../models/db/schema/stop-times";
import { type ColumnBaseConfig, isNull, or, sql } from "drizzle-orm";
import { SQLiteColumn } from "drizzle-orm/sqlite-core";

// don't ask
function toTimestamp(column: SQLiteColumn<ColumnBaseConfig<'string', 'SQLiteText'>>) {
    return sql<Date>`
        (60 * (60 * substr(${column}, 1, instr(${column}, ':') - 1) +
        substr(substr(${column}, instr(${column}, ':') + 1), 1, instr(substr(${column}, instr(${column}, ':') + 1), ':') - 1))) +
        substr(substr(${column}, instr(${column}, ':') + 1), instr(substr(${column}, instr(${column}, ':') + 1), ':') + 1)
    `;
}

async function ensureDatabase() {
    try {
        return new Database(config.sqlitePath);
    }
    catch (e) {
        if ((e instanceof SqliteError) && e.code === 'SQLITE_CANTOPEN') {
            console.log('Database not found, importing GTFS');
            await importGtfs(config);
            console.log('Loaded data, setting arrivalTimestamp and departureTimestamp');
            const db = new Database(config.sqlitePath);
            await drizzle(db).update(stopTimes).set({
                    arrivalTimestamp: toTimestamp(stopTimes.arrivalTime),
                    departureTimestamp: toTimestamp(stopTimes.departureTime),
                })
                .execute();
            console.log('Creating GeoJSON files');
            try {
                const fStops = await fs.open('/usr/data/public/stops.geo.json', 'w');
                const fShapes = await fs.open('/usr/data/public/shapes.geo.json', 'w');
                await Promise.all([
                    fStops.writeFile(JSON.stringify(getStopsAsGeoJSON())),
                    fShapes.writeFile(JSON.stringify(getStopsAsGeoJSON())),
                ]);
            }
            catch (e) {
                console.error('Error while writing GeoJSON files:');
                console.error(e);
            }
            console.log('Database setup complete');
            return db;
        }
        else {
            throw e;
        }
    }
}

export const database = drizzle(await ensureDatabase());
