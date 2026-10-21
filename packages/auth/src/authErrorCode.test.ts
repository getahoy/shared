import { describe, expect, it } from "vitest";
import { toErrorCode } from "./authErrorCode";

describe("toErrorCode", () => {
  it("maps a wrong password to unauthorized", () => {
    expect(toErrorCode({ code: "INVALID_EMAIL_OR_PASSWORD", status: 401 })).toBe("unauthorized");
  });

  it("maps an existing account to conflict", () => {
    expect(toErrorCode({ code: "USER_ALREADY_EXISTS", status: 422 })).toBe("conflict");
  });

  it("falls back to the status when the code is unknown", () => {
    expect(toErrorCode({ code: "SOMETHING_NEW", status: 429 })).toBe("rate_limited");
    expect(toErrorCode({ code: "SOMETHING_NEW", status: 503 })).toBe("broken");
  });

  it("treats no status as a network failure", () => {
    expect(toErrorCode({ status: 0 })).toBe("transient");
    expect(toErrorCode({})).toBe("transient");
  });
});
