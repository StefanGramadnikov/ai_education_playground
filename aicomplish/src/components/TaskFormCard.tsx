import type { FormState } from "@/app/actions";
import { TaskForm } from "./TaskForm";
import page from "./page.module.css";

/** Card with a heading around TaskForm; shared by the New and Edit pages. */
export function TaskFormCard({
  heading,
  action,
  initial,
  submitLabel,
}: {
  heading: string;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial: FormState["values"];
  submitLabel: string;
}) {
  return (
    <section className={page.card}>
      <h2>{heading}</h2>
      <TaskForm action={action} initial={initial} submitLabel={submitLabel} />
    </section>
  );
}
