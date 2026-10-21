import { fontSize, radius, spacing } from "./primitives";
import { type SemanticColors, themes } from "./themes";

const radiusScale = {
  sm: "calc(var(--radius) * 0.6)",
  md: "calc(var(--radius) * 0.8)",
  lg: "var(--radius)",
  xl: "calc(var(--radius) * 1.4)",
  "2xl": "calc(var(--radius) * 1.8)",
} as const;

function toKebabCase(name: string): string {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function declarations(entries: Record<string, string>, indent: string): string {
  return Object.entries(entries)
    .map(([name, entry]) => `${indent}${name}: ${entry};`)
    .join("\n");
}

function prefixed(colors: SemanticColors, prefix: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(colors).map(([name, color]) => [`${prefix}${toKebabCase(name)}`, color]),
  );
}

function scaleVariables(): Record<string, string> {
  return {
    "--radius": radius.base,
    ...Object.fromEntries(
      Object.entries(radiusScale).map(([step, size]) => [`--radius-${step}`, size]),
    ),
    "--spacing": spacing.unit,
    ...Object.fromEntries(Object.entries(fontSize).map(([step, size]) => [`--text-${step}`, size])),
  };
}

export function tailwindThemeCss(): string {
  const colorNames = Object.keys(themes.light).map(toKebabCase);
  const colorMapping = Object.fromEntries(
    colorNames.map((name) => [`--color-${name}`, `var(--${name})`]),
  );
  return [
    `@theme inline {\n${declarations({ ...colorMapping, ...scaleVariables() }, "  ")}\n}`,
    `:root {\n${declarations(prefixed(themes.light, "--"), "  ")}\n}`,
    `.dark {\n${declarations(prefixed(themes.dark, "--"), "  ")}\n}`,
  ].join("\n\n");
}

export function uniwindThemeCss(): string {
  return [
    `@theme {\n${declarations(scaleVariables(), "  ")}\n}`,
    [
      "@layer theme {",
      "  :root {",
      `    @variant light {\n${declarations(prefixed(themes.light, "--color-"), "      ")}\n    }`,
      `    @variant dark {\n${declarations(prefixed(themes.dark, "--color-"), "      ")}\n    }`,
      "  }",
      "}",
    ].join("\n"),
  ].join("\n\n");
}
