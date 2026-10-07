import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteTaskAction } from "@/app/actions";
import page from "@/components/page.module.css";
import ui from "@/components/ui.module.css";
import { getDb } from "@/lib/db/client";
import { getTask } from "@/lib/tasks/repository";

export const metadata: Metadata = { title: "Delete task" };

/** Confirmation page: a plain form posting to a Server Action. */
export default async function DeleteTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const task = Number.isInteger(id) ? getTask(getDb(), id) : null;
  if (!task) notFound();

  return (
    <section className={page.card}>
      <h2>Delete task?</h2>
      <p style={{ overflowWrap: "anywhere" }}>“{task.title}” will be permanently removed.</p>
      <form action={deleteTaskAction.bind(null, task.id)} className={page.footer}>
        <Link href="/tasks" className={ui.btn}>
          Cancel
        </Link>
        <button className={`${ui.btn} ${ui.danger}`}>Delete</button>
      </form>
    </section>
  );
}
