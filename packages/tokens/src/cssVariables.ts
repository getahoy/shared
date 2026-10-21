import type { SemanticColors } from "./themes";

function toKebabCase(name: string): string {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function colorVariables(colors: SemanticColors): Record<string, string> {
  return Object.fromEntries(
    Object.entries(colors).map(([name, color]) => [`--color-${toKebabCase(name)}`, color]),
  );
}
