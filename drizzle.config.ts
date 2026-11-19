import { defineConfig } from 'drizzle-kit'

// Only writes migration files (npm run db:generate); wrangler applies them to D1
export default defineConfig({
  dialect: 'sqlite',
  schema: './worker/db/schema/index.ts',
  out: './drizzle',
})
