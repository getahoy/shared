import { neutral, red, whiteAlpha } from "./primitives";

export type SemanticColors = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
};

export const lightTheme: SemanticColors = {
  background: neutral[0],
  foreground: neutral[950],
  card: neutral[0],
  cardForeground: neutral[950],
  popover: neutral[0],
  popoverForeground: neutral[950],
  primary: neutral[900],
  primaryForeground: neutral[50],
  secondary: neutral[100],
  secondaryForeground: neutral[900],
  muted: neutral[100],
  mutedForeground: neutral[500],
  accent: neutral[100],
  accentForeground: neutral[900],
  destructive: red[500],
  border: neutral[200],
  input: neutral[200],
  ring: neutral[400],
};

export const darkTheme: SemanticColors = {
  background: neutral[950],
  foreground: neutral[50],
  card: neutral[900],
  cardForeground: neutral[50],
  popover: neutral[900],
  popoverForeground: neutral[50],
  primary: neutral[200],
  primaryForeground: neutral[900],
  secondary: neutral[800],
  secondaryForeground: neutral[50],
  muted: neutral[800],
  mutedForeground: neutral[400],
  accent: neutral[800],
  accentForeground: neutral[50],
  destructive: red[400],
  border: whiteAlpha[10],
  input: whiteAlpha[15],
  ring: neutral[500],
};

export const themes = { light: lightTheme, dark: darkTheme } as const;

export type ThemeName = keyof typeof themes;
