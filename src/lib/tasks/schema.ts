/** Validation rules for task input. Runs on the server; client checks are UX only. */
import { z } from "zod";

export const TITLE_MAX = 120;
export const DESCRIPTION_MAX = 2000;

export const taskInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(TITLE_MAX, `Title must be at most ${TITLE_MAX} characters`),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX, `Description must be at most ${DESCRIPTION_MAX} characters`)
    .default(""),
});

export type TaskInput = z.infer<typeof taskInputSchema>;
