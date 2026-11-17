import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './worker/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: 'postgres://testmate:testmate@localhost:5432/testmate',
  },
})
