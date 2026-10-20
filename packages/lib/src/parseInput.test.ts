import { describe, expect, it } from "vitest";
import { signInSchema, signUpSchema } from "./credentialsSchema";
import { parseInput } from "./parseInput";

describe("parseInput", () => {
  it("returns typed input for a valid sign in", () => {
    const values = { email: "ada@example.com", password: "secret" };
    expect(parseInput(signInSchema, values)).toEqual({ outcome: "valid", input: values });
  });

  it("returns the first issue message for an invalid email", () => {
    expect(parseInput(signInSchema, { email: "nope", password: "x" })).toEqual({
      outcome: "invalid",
      message: "Enter a valid email address",
    });
  });

  it("rejects a sign up password shorter than the minimum", () => {
    const values = { name: "Ada", email: "ada@example.com", password: "short" };
    expect(parseInput(signUpSchema, values)).toEqual({
      outcome: "invalid",
      message: "Use at least 8 characters",
    });
  });
});
