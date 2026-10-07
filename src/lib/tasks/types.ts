/** A task as stored in and returned from the database. */
export interface Task {
  id: number;
  title: string;
  description: string;
  /** ISO-8601 UTC timestamp. */
  createdAt: string;
  /** ISO-8601 UTC timestamp. */
  updatedAt: string;
}

/** One page of tasks, newest first. */
export interface TaskPage {
  tasks: Task[];
  /** Current page, 1-based (clamped to the valid range). */
  page: number;
  totalPages: number;
  /** Total number of tasks matching the query. */
  total: number;
}
