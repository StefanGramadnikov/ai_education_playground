/**
 * Versioned schema migrations.
 *
 * The applied version is stored in SQLite's `PRAGMA user_version`. Each pending
 * migration runs inside its own transaction, so a failure never leaves the
 * database half-migrated. To change the schema, append a new entry — never edit
 * or reorder existing ones.
 */
import type { Database } from "better-sqlite3";

const MIGRATIONS: readonly string[] = [
  // 1: initial tasks table
  `CREATE TABLE tasks (
     id          INTEGER PRIMARY KEY AUTOINCREMENT,
     title       TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 120),
     description TEXT NOT NULL DEFAULT '' CHECK (length(description) <= 2000),
     created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
     updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
   );`,
];

/** Applies all migrations newer than the database's current `user_version`. */
export function migrate(db: Database): void {
  const current = db.pragma("user_version", { simple: true }) as number;
  for (let version = current; version < MIGRATIONS.length; version++) {
    db.transaction(() => {
      db.exec(MIGRATIONS[version]);
      // PRAGMA does not accept bound parameters; `version` is a trusted integer.
      db.pragma(`user_version = ${version + 1}`);
    })();
  }
}
