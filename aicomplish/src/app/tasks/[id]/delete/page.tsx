import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteTaskAction } from "@/app/actions";
import { DeleteTaskView } from "@/components/DeleteTaskView";
import { getDb } from "@/lib/db/client";
import { getTask } from "@/lib/tasks/repository";

export const metadata: Metadata = { title: "Delete task" };

/** Loads the task (404 if missing) and renders the confirmation bound to the delete action. */
export default async function DeleteTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const task = Number.isInteger(id) ? getTask(getDb(), id) : null;
  if (!task) notFound();
  return <DeleteTaskView task={task} action={deleteTaskAction.bind(null, task.id)} />;
}
