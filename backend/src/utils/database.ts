import Database, { SqliteError } from "better-sqlite3";
import { importGtfs } from "gtfs";
import config from '../configs/gtfs.config';

export async function ensureDatabase() {
    try {
        return new Database(config.sqlitePath);
    }
    catch (e) {
        if ((e instanceof SqliteError) && e.code === 'SQLITE_CANTOPEN') { 
            console.log('Database not found, importing GTFS');
            await importGtfs(config);
            return new Database(config.sqlitePath);
        }
        else {
            throw e;
        }
    }
}
