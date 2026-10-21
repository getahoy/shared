import { parseInput } from "@getahoy/lib";
import { describe, expect, it } from "vitest";
import { authCopy } from "./authCopy";
import { MINIMUM_PASSWORD_LENGTH, signInSchema, signUpSchema } from "./credentialsSchema";

describe("credentials schemas", () => {
  it("accepts a valid sign in", () => {
    const values = { email: "ada@example.com", password: "secret" };
    expect(parseInput(signInSchema, values)).toEqual({ outcome: "valid", input: values });
  });

  it("uses the shared copy for an invalid email", () => {
    expect(parseInput(signInSchema, { email: "nope", password: "x" })).toEqual({
      outcome: "invalid",
      message: authCopy["validation.email"],
    });
  });

  it("enforces the one password minimum and names it in the message", () => {
    const short = "a".repeat(MINIMUM_PASSWORD_LENGTH - 1);
    const values = { name: "Ada", email: "ada@example.com", password: short };
    expect(parseInput(signUpSchema, values)).toEqual({
      outcome: "invalid",
      message: `Use at least ${MINIMUM_PASSWORD_LENGTH} characters`,
    });
  });
});
