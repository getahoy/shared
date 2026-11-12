export const motionDurationMs = {
  fast: 150,
  base: 240,
  slow: 480,
} as const;

export const motionEasing = {
  out: [0.22, 1, 0.36, 1],
  spring: [0.34, 1.56, 0.64, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const TOAST_MS = 3000;
export const SLOW_AFTER_MS = 6000;
