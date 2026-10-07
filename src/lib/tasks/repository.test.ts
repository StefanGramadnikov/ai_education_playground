import { beforeEach, describe, expect, it } from "vitest";
import type { Database } from "better-sqlite3";
import { openDatabase } from "@/lib/db/client";
import { migrate } from "@/lib/db/migrations";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "./repository";
import { taskInputSchema } from "./schema";

let db: Database;
beforeEach(() => {
  db = openDatabase(":memory:");
});

describe("migrations", () => {
  it("are idempotent", () => {
    migrate(db);
    migrate(db);
    expect(db.pragma("user_version", { simple: true })).toBe(1);
  });
});

describe("repository", () => {
  it("creates, updates and deletes", () => {
    const t = createTask(db, { title: "A", description: "d" });
    expect(t.id).toBeGreaterThan(0);
    expect(updateTask(db, t.id, { title: "B", description: "" })?.title).toBe("B");
    expect(updateTask(db, 999, { title: "x", description: "" })).toBeNull();
    expect(deleteTask(db, t.id)).toBe(true);
    expect(deleteTask(db, t.id)).toBe(false);
  });

  it("paginates newest-first and clamps the page", () => {
    for (let i = 1; i <= 7; i++) createTask(db, { title: `t${i}`, description: "" });
    const p1 = listTasks(db, { pageSize: 3 });
    expect(p1.tasks.map((t) => t.title)).toEqual(["t7", "t6", "t5"]);
    expect([p1.total, p1.totalPages, p1.page]).toEqual([7, 3, 1]);
    expect(listTasks(db, { pageSize: 3, page: 2 }).tasks.map((t) => t.title)).toEqual(["t4", "t3", "t2"]);
    const last = listTasks(db, { pageSize: 3, page: 99 });
    expect([last.page, last.tasks.map((t) => t.title)]).toEqual([3, ["t1"]]);
  });

  it("gets a task by id", () => {
    const t = createTask(db, { title: "A", description: "" });
    expect(getTask(db, t.id)?.title).toBe("A");
    expect(getTask(db, 999)).toBeNull();
  });

  it("searches title and description, treating wildcards literally", () => {
    createTask(db, { title: "Buy milk", description: "" });
    createTask(db, { title: "Other", description: "100% done" });
    expect(listTasks(db, { query: "MILK" }).total).toBe(1);
    expect(listTasks(db, { query: "100%" }).total).toBe(1);
    expect(listTasks(db, { query: "%" }).total).toBe(1);
    expect(listTasks(db, { query: "_" }).total).toBe(0);
  });
});

describe("taskInputSchema", () => {
  it("trims and validates", () => {
    expect(taskInputSchema.parse({ title: "  hi  " })).toEqual({ title: "hi", description: "" });
    expect(taskInputSchema.safeParse({ title: "   " }).success).toBe(false);
    expect(taskInputSchema.safeParse({ title: "x".repeat(121) }).success).toBe(false);
  });
});
