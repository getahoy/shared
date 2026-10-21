import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseInput } from "./parseInput";

const deviceNameSchema = z.object({
  name: z.string().trim().min(1, "Enter a name"),
});

describe("parseInput", () => {
  it("returns typed input when the schema passes", () => {
    expect(parseInput(deviceNameSchema, { name: " Laptop " })).toEqual({
      outcome: "valid",
      input: { name: "Laptop" },
    });
  });

  it("returns the first issue message when the schema fails", () => {
    expect(parseInput(deviceNameSchema, { name: "  " })).toEqual({
      outcome: "invalid",
      message: "Enter a name",
    });
  });

  it("treats a missing field as invalid, not a crash", () => {
    expect(parseInput(deviceNameSchema, {}).outcome).toBe("invalid");
  });
});
