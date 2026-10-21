import { describe, expect, it } from "vitest";
import { tailwindThemeCss, uniwindThemeCss } from "./cssFormats";
import { darkTheme, lightTheme } from "./themes";

describe("tailwindThemeCss", () => {
  const css = tailwindThemeCss();

  it("maps utility colours to theme variables like shadcn expects", () => {
    expect(css).toContain("--color-primary-foreground: var(--primary-foreground);");
  });

  it("defines light values on :root and dark values on .dark", () => {
    expect(css).toContain(`:root {\n  --background: ${lightTheme.background};`);
    expect(css).toContain(`.dark {\n  --background: ${darkTheme.background};`);
  });

  it("carries radius, spacing and font size from the tokens", () => {
    expect(css).toContain("--radius: 0.625rem;");
    expect(css).toContain("--spacing: 0.25rem;");
    expect(css).toContain("--text-sm: 0.875rem;");
  });
});

describe("uniwindThemeCss", () => {
  const css = uniwindThemeCss();

  it("puts light and dark colours in uniwind variants", () => {
    expect(css).toContain(`@variant light {\n      --color-background: ${lightTheme.background};`);
    expect(css).toContain(`@variant dark {\n      --color-background: ${darkTheme.background};`);
  });

  it("carries the same scale as the tailwind output", () => {
    expect(css).toContain("--radius-md: calc(var(--radius) * 0.8);");
  });
});
