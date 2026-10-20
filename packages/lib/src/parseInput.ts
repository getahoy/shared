import type { z } from "zod";

const FALLBACK_MESSAGE = "Check the form and try again";

export type ParsedInput<T> =
  | { outcome: "valid"; input: T }
  | { outcome: "invalid"; message: string };

export function parseInput<T>(schema: z.ZodType<T>, values: unknown): ParsedInput<T> {
  const parsed = schema.safeParse(values);
  if (parsed.success) return { outcome: "valid", input: parsed.data };
  return {
    outcome: "invalid",
    message: parsed.error.issues[0]?.message ?? FALLBACK_MESSAGE,
  };
}
