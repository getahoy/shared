import type { z } from "zod";

export function parseStored<T>(schema: z.ZodType<T>, text: string | null | undefined): T | null {
  if (text === null || text === undefined) return null;
  try {
    const parsed = schema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
