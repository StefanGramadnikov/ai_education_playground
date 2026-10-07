import Link from "next/link";
import type { Task } from "@/lib/tasks/types";
import page from "./page.module.css";
import ui from "./ui.module.css";

/** Delete confirmation. `action` is the Server Action to run on confirm (stubbed in tests). */
export function DeleteTaskView({ task, action }: { task: Task; action: () => void | Promise<void> }) {
  return (
    <section className={page.card}>
      <h2>Delete task?</h2>
      <p style={{ overflowWrap: "anywhere" }}>“{task.title}” will be permanently removed.</p>
      <form action={action} className={page.footer}>
        <Link href="/tasks" className={ui.btn} data-cy="cancel">
          Cancel
        </Link>
        <button className={`${ui.btn} ${ui.danger}`} data-cy="confirm-delete">Delete</button>
      </form>
    </section>
  );
}
