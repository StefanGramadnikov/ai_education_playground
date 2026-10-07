/**
 * Server Action tests: validation, persistence, revalidation and redirects.
 * The database is a fresh in-memory SQLite per test; Next's `redirect` and
 * `revalidatePath` are mocked so we can observe them.
 * Lives under /tests with the rest of the test suite.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "better-sqlite3";
import { openDatabase } from "@/lib/db/client";
import { createTask, getTask, listTasks } from "@/lib/tasks/repository";

const ctx = vi.hoisted(() => ({ db: null as unknown as Database, failDb: false }));

vi.mock("@/lib/db/client", async (original) => ({
  ...(await original<typeof import("@/lib/db/client")>()),
  getDb: () => {
    if (ctx.failDb) throw new Error("db down");
    return ctx.db;
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  // Like the real one, redirect() never returns: it throws.
  redirect: vi.fn((url: string) => {
    throw Object.assign(new Error("NEXT_REDIRECT"), { url });
  }),
}));

import { revalidatePath } from "next/cache";
import { createTaskAction, deleteTaskAction, updateTaskAction } from "@/app/actions";

const form = (title: string, description = "") => {
  const f = new FormData();
  f.set("title", title);
  f.set("description", description);
  return f;
};
const EMPTY = { error: null, values: { title: "", description: "" } };

beforeEach(() => {
  ctx.db = openDatabase(":memory:");
  ctx.failDb = false;
  vi.mocked(revalidatePath).mockClear();
});

describe("createTaskAction", () => {
  it("valid input → saves a trimmed task, revalidates and redirects to /tasks", async () => {
    await expect(createTaskAction(EMPTY, form("  Buy milk  ", " 2 litres "))).rejects.toMatchObject({ url: "/tasks" });

    expect(listTasks(ctx.db).tasks).toMatchObject([{ title: "Buy milk", description: "2 litres" }]);
    expect(revalidatePath).toHaveBeenCalledWith("/tasks");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("blank title → returns an error and the typed values, saves nothing", async () => {
    const state = await createTaskAction(EMPTY, form("   ", "keep me"));

    expect(state).toEqual({ error: "Title is required", values: { title: "   ", description: "keep me" } });
    expect(listTasks(ctx.db).total).toBe(0);
  });

  it("title over 120 chars → returns the length error", async () => {
    const state = await createTaskAction(EMPTY, form("x".repeat(121)));

    expect(state.error).toMatch(/at most 120/);
  });

  it("database failure → returns a friendly error instead of throwing", async () => {
    ctx.failDb = true;

    const state = await createTaskAction(EMPTY, form("Valid"));

    expect(state.error).toBe("Could not save the task. Please try again.");
    expect(state.values.title).toBe("Valid");
  });
});

describe("updateTaskAction", () => {
  it("existing task → updates it and redirects to /tasks", async () => {
    const { id } = createTask(ctx.db, { title: "Old", description: "" });

    await expect(updateTaskAction(id, EMPTY, form("New", "desc"))).rejects.toMatchObject({ url: "/tasks" });

    expect(getTask(ctx.db, id)).toMatchObject({ title: "New", description: "desc" });
    expect(revalidatePath).toHaveBeenCalledWith("/tasks");
  });

  it("missing task → returns a 'no longer exists' error", async () => {
    const state = await updateTaskAction(999, EMPTY, form("Whatever"));

    expect(state.error).toBe("This task no longer exists.");
  });

  it("invalid input → returns the validation error and leaves the task unchanged", async () => {
    const { id } = createTask(ctx.db, { title: "Keep", description: "" });

    const state = await updateTaskAction(id, EMPTY, form(""));

    expect(state.error).toBe("Title is required");
    expect(getTask(ctx.db, id)?.title).toBe("Keep");
  });

  it("database failure → returns a friendly error", async () => {
    ctx.failDb = true;

    expect((await updateTaskAction(1, EMPTY, form("x"))).error).toBe("Could not save the task. Please try again.");
  });
});

describe("deleteTaskAction", () => {
  it("existing task → deletes it, revalidates and redirects to /tasks", async () => {
    const { id } = createTask(ctx.db, { title: "Bye", description: "" });

    await expect(deleteTaskAction(id)).rejects.toMatchObject({ url: "/tasks" });

    expect(getTask(ctx.db, id)).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith("/tasks");
  });

  it("already-deleted task → is idempotent and still redirects", async () => {
    await expect(deleteTaskAction(999)).rejects.toMatchObject({ url: "/tasks" });
  });
});
