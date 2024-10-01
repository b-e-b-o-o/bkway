import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const agency = sqliteTable('agency', {
    agencyId: text('agency_id'),
    agencyName: text('agency_name').primaryKey().notNull(),
    agencyUrl: text('agency_url').notNull(),
    agencyTimezone: text('agency_timezone').notNull(),
    agencyLang: text('agency_lang'),
    agencyPhone: text('agency_phone'),
    agencyFareUrl: text('agency_fare_url'),
    agencyEmail: text('agency_email')
});
