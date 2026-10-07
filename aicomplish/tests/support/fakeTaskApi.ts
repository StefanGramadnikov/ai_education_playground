/**
 * Stateful in-memory stand-in for the Server Actions in src/app/actions.ts.
 *
 * It applies the REAL validation schema and returns the same FormState shapes
 * and error messages as the real actions, so flow tests exercise realistic
 * success and failure paths without a server or database. Where the real action
 * calls redirect() on success, the fake records the target in `navigatedTo`.
 * Create one per test (e.g. in beforeEach); nothing is shared between tests.
 */
import type { FormState } from "@/app/actions";
import { taskInputSchema } from "@/lib/tasks/schema";
import type { Task } from "@/lib/tasks/types";

const SAVE_ERROR = "Could not save the task. Please try again.";

export function createFakeTaskApi(seed: Task[] = []) {
  const api = {
    /** The "database". Mutated in place so tests can assert on it. */
    tasks: [...seed],
    /** Where the real action would have redirected to, or null if it hasn't. */
    navigatedTo: null as string | null,
    /** When set, the next save/delete fails like a database error. */
    failNext: false,
    /** When set, the next action waits for it (simulates a slow request). */
    gate: null as Promise<void> | null,

    /** Makes the next action wait until the returned function is called. */
    holdNext(): () => void {
      let release!: () => void;
      api.gate = new Promise<void>((resolve) => (release = resolve));
      return release;
    },

    async create(_prev: FormState, formData: FormData): Promise<FormState> {
      const values = readForm(formData);
      await api.wait();
      const parsed = taskInputSchema.safeParse(values);
      if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input", values };
      if (api.consumeFailure()) return { error: SAVE_ERROR, values };
      const now = new Date().toISOString();
      const id = Math.max(0, ...api.tasks.map((t) => t.id)) + 1;
      api.tasks.unshift({ id, ...parsed.data, createdAt: now, updatedAt: now });
      api.navigatedTo = "/tasks";
      return { error: null, values };
    },

    /** Returns an action bound to task `id`, like `updateTaskAction.bind(null, id)`. */
    update(id: number) {
      return async (_prev: FormState, formData: FormData): Promise<FormState> => {
        const values = readForm(formData);
        await api.wait();
        const parsed = taskInputSchema.safeParse(values);
        if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input", values };
        if (api.consumeFailure()) return { error: SAVE_ERROR, values };
        const task = api.tasks.find((t) => t.id === id);
        if (!task) return { error: "This task no longer exists.", values };
        Object.assign(task, parsed.data, { updatedAt: new Date().toISOString() });
        api.navigatedTo = "/tasks";
        return { error: null, values };
      };
    },

    /** Returns an action bound to task `id`, like `deleteTaskAction.bind(null, id)`. */
    remove(id: number) {
      return async (): Promise<void> => {
        await api.wait();
        api.removeFromStore(id); // deleting a missing task is a no-op
        api.navigatedTo = "/tasks";
      };
    },

    /** Removes in place so arrays captured by tests (cy.wrap(api.tasks)) stay live. */
    removeFromStore(id: number) {
      const index = api.tasks.findIndex((t) => t.id === id);
      if (index >= 0) api.tasks.splice(index, 1);
    },
    async wait() {
      if (api.gate) await api.gate;
      api.gate = null;
    },
    consumeFailure() {
      const failed = api.failNext;
      api.failNext = false;
      return failed;
    },
  };
  return api;
}

export type FakeTaskApi = ReturnType<typeof createFakeTaskApi>;

function readForm(formData: FormData): FormState["values"] {
  return { title: String(formData.get("title") ?? ""), description: String(formData.get("description") ?? "") };
}
