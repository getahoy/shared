import type { z } from "zod";

const FALLBACK_MESSAGE = "Check the form and try again.";

export type ParsedInput<T> =
  | { outcome: "valid"; input: T }
  | { outcome: "invalid"; message: string; field: string | null };

export function parseInput<T>(schema: z.ZodType<T>, values: unknown): ParsedInput<T> {
  const parsed = schema.safeParse(values);
  if (parsed.success) return { outcome: "valid", input: parsed.data };
  const issue = parsed.error.issues[0];
  const path = issue?.path.join(".") ?? "";
  return {
    outcome: "invalid",
    message: issue?.message ?? FALLBACK_MESSAGE,
    field: path === "" ? null : path,
  };
}
