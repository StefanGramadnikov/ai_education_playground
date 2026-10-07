"use client";

/**
 * Create/edit form. The only client component: it uses `useActionState` to show
 * validation errors and a pending state. It is a real <form>, so submission
 * works (and validates server-side) even before hydration or without JS.
 */
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/app/actions";
import { DESCRIPTION_MAX, TITLE_MAX } from "@/lib/tasks/schema";
import styles from "./TaskForm.module.css";
import ui from "./ui.module.css";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" data-cy="submit" className={`${ui.btn} ${ui.primary}`} disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export function TaskForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial: FormState["values"];
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, { error: null, values: initial });

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.label}>
        Title
        <input
          className={ui.field}
          name="title"
          data-cy="title-input"
          required
          maxLength={TITLE_MAX}
          autoFocus
          defaultValue={state.values.title}
        />
      </label>
      <label className={styles.label}>
        Description
        <textarea
          className={ui.field}
          name="description"
          data-cy="description-input"
          maxLength={DESCRIPTION_MAX}
          defaultValue={state.values.description}
        />
      </label>
      {state.error && (
        <p className={styles.error} role="alert" data-cy="form-error">
          {state.error}
        </p>
      )}
      <div className={styles.footer}>
        <Link href="/tasks" className={ui.btn} data-cy="cancel">
          Cancel
        </Link>
        <Submit label={submitLabel} />
      </div>
    </form>
  );
}
