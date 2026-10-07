import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateTaskAction } from "@/app/actions";
import { TaskFormCard } from "@/components/TaskFormCard";
import { getDb } from "@/lib/db/client";
import { getTask } from "@/lib/tasks/repository";

export const metadata: Metadata = { title: "Edit task" };

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const task = Number.isInteger(id) ? getTask(getDb(), id) : null;
  if (!task) notFound();

  return (
    <TaskFormCard
      heading="Edit task"
      action={updateTaskAction.bind(null, task.id)}
      initial={{ title: task.title, description: task.description }}
      submitLabel="Save"
    />
  );
}
