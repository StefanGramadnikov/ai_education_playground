/**
 * SQLite connection management.
 *
 * A single connection is shared per server process (cached on `globalThis` so
 * Next.js dev hot-reloads don't open duplicates). WAL mode gives concurrent
 * readers during writes and crash-safe durability.
 */
import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { migrate } from "./migrations";

const globalForDb = globalThis as unknown as { __aicomplishDb?: Database.Database };

/** Opens (and migrates) a database at `file`; use `":memory:"` in tests. */
export function openDatabase(file: string): Database.Database {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");
  db.pragma("busy_timeout = 5000");
  db.pragma("foreign_keys = ON");
  migrate(db);
  return db;
}

/** Returns the shared application database, creating it on first use. */
export function getDb(): Database.Database {
  if (!globalForDb.__aicomplishDb) {
    const file = path.resolve(/*turbopackIgnore: true*/ process.env.DATABASE_PATH ?? "./data/aicomplish.db");
    const db = openDatabase(file);
    process.once("exit", () => db.close());
    globalForDb.__aicomplishDb = db;
  }
  return globalForDb.__aicomplishDb;
}
