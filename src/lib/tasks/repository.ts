/**
 * Task persistence. All SQL is parameterized. Every function takes the database
 * as its first argument so it can be tested against an in-memory instance.
 *
 * Tasks are ordered newest-first by `id` and paginated with LIMIT/OFFSET.
 */
import type { Database } from "better-sqlite3";
import type { TaskInput } from "./schema";
import type { Task, TaskPage } from "./types";

export const PAGE_SIZE = 30;

interface Row {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const toTask = (r: Row): Task => ({
  id: r.id,
  title: r.title,
  description: r.description,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

/** Escapes `%`, `_` and `\` so user text is matched literally by LIKE. */
const likePattern = (q: string) => `%${q.replace(/[\\%_]/g, "\\$&")}%`;

/** Lists one page (1-based) of tasks, optionally filtered by a title/description substring. */
export function listTasks(
  db: Database,
  opts: { query?: string; page?: number; pageSize?: number } = {},
): TaskPage {
  const pageSize = Math.min(Math.max(opts.pageSize ?? PAGE_SIZE, 1), 100);
  const query = opts.query?.trim() ?? "";
  const filter = `(@q = '' OR title LIKE @pattern ESCAPE '\\' OR description LIKE @pattern ESCAPE '\\')`;
  const base = { q: query, pattern: likePattern(query) };

  const { total } = db
    .prepare<typeof base, { total: number }>(`SELECT COUNT(*) AS total FROM tasks WHERE ${filter}`)
    .get(base)!;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(opts.page ?? 1, 1), totalPages);

  const params = { ...base, limit: pageSize, offset: (page - 1) * pageSize };
  const rows = db
    .prepare<typeof params, Row>(
      `SELECT * FROM tasks WHERE ${filter} ORDER BY id DESC LIMIT @limit OFFSET @offset`,
    )
    .all(params);

  return { tasks: rows.map(toTask), page, totalPages, total };
}

/** Fetches a single task, or `null` if it does not exist. */
export function getTask(db: Database, id: number): Task | null {
  const row = db.prepare<[number], Row>("SELECT * FROM tasks WHERE id = ?").get(id);
  return row ? toTask(row) : null;
}

/** Inserts a task and returns it. */
export function createTask(db: Database, input: TaskInput): Task {
  const row = db
    .prepare<TaskInput, Row>(
      `INSERT INTO tasks (title, description) VALUES (@title, @description) RETURNING *`,
    )
    .get(input)!;
  return toTask(row);
}

/** Updates a task; returns `null` if it does not exist. */
export function updateTask(db: Database, id: number, input: TaskInput): Task | null {
  const row = db
    .prepare<TaskInput & { id: number }, Row>(
      `UPDATE tasks
       SET title = @title, description = @description,
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       WHERE id = @id RETURNING *`,
    )
    .get({ ...input, id });
  return row ? toTask(row) : null;
}

/** Deletes a task; returns whether a row was removed. */
export function deleteTask(db: Database, id: number): boolean {
  return db.prepare("DELETE FROM tasks WHERE id = ?").run(id).changes > 0;
}
