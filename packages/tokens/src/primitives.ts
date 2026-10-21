export const neutral = {
  0: "oklch(1 0 0)",
  50: "oklch(0.985 0 0)",
  100: "oklch(0.97 0 0)",
  200: "oklch(0.922 0 0)",
  400: "oklch(0.708 0 0)",
  500: "oklch(0.556 0 0)",
  800: "oklch(0.269 0 0)",
  900: "oklch(0.205 0 0)",
  950: "oklch(0.145 0 0)",
} as const;

export const red = {
  400: "oklch(0.704 0.191 22.216)",
  500: "oklch(0.577 0.245 27.325)",
} as const;

export const whiteAlpha = {
  10: "oklch(1 0 0 / 10%)",
  15: "oklch(1 0 0 / 15%)",
} as const;

export const radius = {
  base: "0.625rem",
} as const;

export const spacing = {
  unit: "0.25rem",
} as const;

export const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
} as const;
