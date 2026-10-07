import Link from "next/link";
import type { Task } from "@/lib/tasks/types";
import ui from "./ui.module.css";
import styles from "./TaskItem.module.css";

const LONG = 160;

const stamp = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
const full = new Intl.DateTimeFormat("en", { dateStyle: "long", timeStyle: "short" });

/** "Updated Oct 7, 20:43"; the tooltip also shows when the task was created. */
function Updated({ task }: { task: Task }) {
  return (
    <time
      className={styles.updated} data-cy="task-updated"
      dateTime={task.updatedAt}
      title={`Created ${full.format(new Date(task.createdAt))}\nUpdated ${full.format(new Date(task.updatedAt))}`}
    >
      Updated {stamp.format(new Date(task.updatedAt))}
    </time>
  );
}

/** A single task card (server component; "show more" uses native <details>). */
export function TaskItem({ task }: { task: Task }) {
  const long = task.description.length > LONG || task.description.split("\n").length > 3;
  return (
    <li className={styles.card} data-cy="task-item">
      <div className={styles.body}>
        <h3 className={styles.title} data-cy="task-title">{task.title}</h3>
        {task.description &&
          (long ? (
            <details className={styles.details} data-cy="task-details">
              <summary>
                <span className={styles.desc} data-cy="task-description">{task.description}</span>
              </summary>
              <p className={styles.desc} data-cy="task-description-full">{task.description}</p>
            </details>
          ) : (
            <p className={styles.desc} data-cy="task-description">{task.description}</p>
          ))}
        <Updated task={task} />
      </div>
      <div className={styles.actions}>
        <Link className={`${ui.icon} ${ui.edit}`} href={`/tasks/${task.id}/edit`} data-cy="edit-task" aria-label={`Edit ${task.title}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
        </Link>
        <Link className={`${ui.icon} ${ui.del}`} href={`/tasks/${task.id}/delete`} data-cy="delete-task" aria-label={`Delete ${task.title}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg>
        </Link>
      </div>
    </li>
  );
}
