import { errorMessages } from "@getahoy/lib";
import { describe, expect, it } from "vitest";
import { authCopy } from "./authCopy";
import { authErrorMessage } from "./authErrorMessage";

describe("authErrorMessage", () => {
  it("uses auth wording where auth has its own", () => {
    expect(authErrorMessage("unauthorized")).toBe(authCopy["error.unauthorized"]);
    expect(authErrorMessage("conflict")).toBe(authCopy["error.conflict"]);
  });

  it("falls back to the generic message otherwise", () => {
    expect(authErrorMessage("transient")).toBe(errorMessages.transient);
  });
});
