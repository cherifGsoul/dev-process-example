import type { Kyselify } from "drizzle-orm/kysely";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { integer, text, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import {
  CamelCasePlugin,
  Kysely,
  ParseJSONResultsPlugin,
  PostgresDialect,
} from "kysely";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://courses:courses@localhost:5433/courses",
});

export const drzledb = drizzle(pool);

export const courses = pgTable("courses", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title").notNull().unique(),
  min: integer("min").notNull(),
  max: integer("max").notNull(),
  learners: text("learners")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
});

export interface KDatabase {
  courses: Kyselify<typeof courses>;
}

export const kyselyDb = new Kysely<KDatabase>({
  dialect: new PostgresDialect({
    pool,
  }),
  plugins: [new ParseJSONResultsPlugin(), new CamelCasePlugin()],
});
