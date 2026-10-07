import type { Metadata } from "next";
import { createTaskAction } from "@/app/actions";
import { TaskFormCard } from "@/components/TaskFormCard";

export const metadata: Metadata = { title: "New task" };

export default function NewTaskPage() {
  return (
    <TaskFormCard
      heading="New task"
      action={createTaskAction}
      initial={{ title: "", description: "" }}
      submitLabel="Create"
    />
  );
}
