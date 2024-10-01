import { sqliteTable, text, real, integer, primaryKey } from "drizzle-orm/sqlite-core";

export const shapes = sqliteTable('shapes', {
    shapeId: text('shape_id').notNull(),
    shapePtLat: real('shape_pt_lat').notNull(),
    shapePtLon: real('shape_pt_lon').notNull(),
    shapePtSequence: integer('shape_pt_sequence').notNull(),
    shapeDistTravaled: real('shape_dist_traveled')
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.shapeId, table.shapePtSequence] })
    }
});
