import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const feedInfo = sqliteTable('feed_info', {
    feedPublisherName: text('feed_publisher_name').notNull(),
    feedPublisherUrl: text('feed_publisher_url').notNull(),
    feedLang: text('feed_lang').notNull(),
    defaultLang: text('default_lang'),
    feedStartDate: integer('feed_start_date', { mode: 'timestamp' }),
    feedEndDate: integer('feed_end_date', { mode: 'timestamp' }),
    feedVersion: text('feed_version'),
    feedContactEmail: text('feed_contact_email'),
    feedContactUrl: text('feed_contact_url')
});
