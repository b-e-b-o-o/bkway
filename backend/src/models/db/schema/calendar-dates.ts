import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

enum ExceptionType {
    ADDED = 1,
    REMOVED = 2
}

export const calendarDates = sqliteTable('calendar_dates', {
    serviceId: text('service_id').primaryKey().notNull(),
    date: integer('date', { mode: 'timestamp' }).notNull(),
    exceptionType: integer('exception_type').notNull().$type<ExceptionType>(),
    holidayName: text('holiday_name')
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.serviceId, table.date] })
    }
});
