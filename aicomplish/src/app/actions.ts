"use server";

/**
 * Server Actions: invoked directly by <form action>, so they work with or
 * without client JavaScript. Each validates input, calls the repository, then
 * redirects (success) or returns an error state for the form to display.
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db/client";
import * as repo from "@/lib/tasks/repository";
import { taskInputSchema } from "@/lib/tasks/schema";

/** State returned to `useActionState` forms; `values` keeps the user's input on error. */
export interface FormState {
  error: string | null;
  values: { title: string; description: string };
}

function readForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}

function validate(values: FormState["values"]) {
  const result = taskInputSchema.safeParse(values);
  return result.success
    ? { input: result.data }
    : { error: result.error.issues[0]?.message ?? "Invalid input" };
}

export async function createTaskAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = readForm(formData);
  const { input, error } = validate(values);
  if (!input) return { error, values };
  try {
    repo.createTask(getDb(), input);
  } catch {
    return { error: "Could not save the task. Please try again.", values };
  }
  revalidatePath("/");
  redirect("/");
}

export async function updateTaskAction(
  id: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = readForm(formData);
  const { input, error } = validate(values);
  if (!input) return { error, values };
  try {
    if (!repo.updateTask(getDb(), id, input)) {
      return { error: "This task no longer exists.", values };
    }
  } catch {
    return { error: "Could not save the task. Please try again.", values };
  }
  revalidatePath("/");
  redirect("/");
}

export async function deleteTaskAction(id: number): Promise<void> {
  repo.deleteTask(getDb(), id);
  revalidatePath("/");
  redirect("/");
}
