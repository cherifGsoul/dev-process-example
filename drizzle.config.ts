import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: "./src/config/db/index.ts",
  out: "drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://courses:courses@localhost:5433/courses",
  },
  verbose: true,
  strict: true,
})