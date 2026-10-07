import Link from "next/link";
import type { Task } from "@/lib/tasks/types";
import { TaskItem } from "./TaskItem";
import page from "./page.module.css";

/** Presentational body of the Today (home) page. `dateLabel` is passed in to keep it deterministic. */
export function TodayView({ tasks, total, dateLabel }: { tasks: Task[]; total: number; dateLabel: string }) {
  return (
    <>
      <section className={page.hero}>
        <p className={page.eyebrow} data-cy="date">{dateLabel}</p>
        <h2 className={page.title}>Today</h2>
        <p className={page.meta} data-cy="summary">
          {total === 0 ? "You have no tasks yet." : `You have ${total} ${total === 1 ? "task" : "tasks"}.`}
        </p>
      </section>

      {tasks.length > 0 ? (
        <>
          <div className={page.sectionHead}>
            <h3>Latest tasks</h3>
            <Link href="/tasks">View all →</Link>
          </div>
          <ul className={page.list}>
            {tasks.map((t) => (
              <TaskItem key={t.id} task={t} />
            ))}
          </ul>
        </>
      ) : (
        <div className={page.empty} data-cy="empty-state">
          <h2>Nothing here yet</h2>
          <p>
            <Link href="/tasks/new">Create your first task</Link> to get started.
          </p>
        </div>
      )}
    </>
  );
}
