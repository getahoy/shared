import { z } from "zod";

export const APPEARANCES = ["system", "light", "dark"] as const;

export const appearanceSchema = z.enum(APPEARANCES);
export const resolvedThemeSchema = z.enum(["light", "dark"]);

export type Appearance = z.infer<typeof appearanceSchema>;
export type ResolvedTheme = z.infer<typeof resolvedThemeSchema>;

export const appearanceCopy = {
  title: "Appearance",
  options: {
    system: "System",
    light: "Light",
    dark: "Dark",
  } satisfies Record<Appearance, string>,
} as const;
