import Link from "next/link";
import { connection } from "next/server";
import { TaskItem } from "@/components/TaskItem";
import page from "@/components/page.module.css";
import { getDb } from "@/lib/db/client";
import { listTasks } from "@/lib/tasks/repository";

/** Home ("Today"): date, task summary and the latest tasks. Always rendered per request. */
export default async function TodayPage() {
  await connection(); // reads the DB, so never prerender at build time
  const { tasks, total } = listTasks(getDb(), { pageSize: 5 });
  const today = new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" });

  return (
    <>
      <section className={page.hero}>
        <p className={page.eyebrow}>{today}</p>
        <h2 className={page.title}>Today</h2>
        <p className={page.meta}>
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
        <div className={page.empty}>
          <h2>Nothing here yet</h2>
          <p>
            <Link href="/tasks/new">Create your first task</Link> to get started.
          </p>
        </div>
      )}
    </>
  );
}
