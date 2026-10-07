import type { Metadata } from "next";
import { createTaskAction } from "@/app/actions";
import { TaskForm } from "@/components/TaskForm";
import page from "@/components/page.module.css";

export const metadata: Metadata = { title: "New task" };

export default function NewTaskPage() {
  return (
    <section className={page.card}>
      <h2>New task</h2>
      <TaskForm action={createTaskAction} initial={{ title: "", description: "" }} submitLabel="Create" />
    </section>
  );
}
