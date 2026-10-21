import { describe, expect, it } from "vitest";
import { colorVariables } from "./cssVariables";
import { darkTheme, lightTheme } from "./themes";

describe("colorVariables", () => {
  it("names variables the way shadcn and react native reusables read them", () => {
    const variables = colorVariables(lightTheme);
    expect(variables["--color-background"]).toBe(lightTheme.background);
    expect(variables["--color-primary-foreground"]).toBe(lightTheme.primaryForeground);
    expect(variables["--color-muted-foreground"]).toBe(lightTheme.mutedForeground);
  });

  it("gives light and dark the same variable names", () => {
    expect(Object.keys(colorVariables(darkTheme))).toEqual(Object.keys(colorVariables(lightTheme)));
  });
});
