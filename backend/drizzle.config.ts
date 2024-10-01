import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'sqlite',
    schema: './src/models/db/schema/*.ts',
    dbCredentials: {
        url: 'file:../data/db.sqlite' // use actual location, not docker mount location
    }
});
