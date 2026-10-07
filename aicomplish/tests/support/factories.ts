/** Test data builders. Each call returns a fresh object, so tests never share state. */
import type { Task, TaskPage } from "@/lib/tasks/types";

export function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: "Write report",
    description: "Draft the intro",
    createdAt: "2026-10-01T08:00:00.000Z",
    updatedAt: "2026-10-07T20:43:00.000Z",
    ...overrides,
  };
}

/** `n` tasks with ids n..1 (newest first, like the repository). */
export function makeTasks(n: number): Task[] {
  return Array.from({ length: n }, (_, i) => makeTask({ id: n - i, title: `Task ${n - i}`, description: `Description ${n - i}` }));
}

export function makePage(overrides: Partial<TaskPage> = {}): TaskPage {
  const tasks = overrides.tasks ?? makeTasks(3);
  return { tasks, page: 1, totalPages: 1, total: tasks.length, ...overrides };
}
