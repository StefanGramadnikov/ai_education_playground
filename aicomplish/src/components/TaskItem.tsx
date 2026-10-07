import Link from "next/link";
import type { Task } from "@/lib/tasks/types";
import ui from "./ui.module.css";
import styles from "./TaskItem.module.css";

const LONG = 160;

/** A single task card (server component; "show more" uses native <details>). */
export function TaskItem({ task }: { task: Task }) {
  const long = task.description.length > LONG || task.description.split("\n").length > 3;
  return (
    <li className={styles.card}>
      <div className={styles.body}>
        <h3 className={styles.title}>{task.title}</h3>
        {task.description &&
          (long ? (
            <details className={styles.details}>
              <summary>
                <span className={styles.desc}>{task.description}</span>
              </summary>
              <p className={styles.desc}>{task.description}</p>
            </details>
          ) : (
            <p className={styles.desc}>{task.description}</p>
          ))}
      </div>
      <div className={styles.actions}>
        <Link className={ui.icon} href={`/tasks/${task.id}/edit`} aria-label={`Edit ${task.title}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
        </Link>
        <Link className={`${ui.icon} ${ui.del}`} href={`/tasks/${task.id}/delete`} aria-label={`Delete ${task.title}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg>
        </Link>
      </div>
    </li>
  );
}
