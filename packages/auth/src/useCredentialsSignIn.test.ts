import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { authCopy } from "./authCopy";
import { type UseCredentialsSignInOptions, useCredentialsSignIn } from "./useCredentialsSignIn";

const validEmail = "ada@example.com";

function renderSignIn(
  signIn: UseCredentialsSignInOptions["signIn"] = vi.fn(async () => ({ error: null })),
) {
  const onSuccess = vi.fn();
  const view = renderHook(() => useCredentialsSignIn({ signIn, onSuccess }));
  return { ...view, signIn, onSuccess };
}

describe("useCredentialsSignIn", () => {
  it("rejects invalid input without calling the injected signIn", () => {
    const { result, signIn } = renderSignIn();
    act(() => result.current.submit());
    expect(result.current.errorMessage).toBe(authCopy["validation.email"]);
    expect(signIn).not.toHaveBeenCalled();
  });

  it("calls signIn with parsed input, then onSuccess", async () => {
    const { result, signIn, onSuccess } = renderSignIn();
    act(() => result.current.setField("email", validEmail));
    act(() => result.current.setField("password", "secret"));
    act(() => result.current.submit());
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(signIn).toHaveBeenCalledWith({ email: validEmail, password: "secret" });
  });

  it("maps a provider error to the shared copy and skips onSuccess", async () => {
    const failing = vi.fn(async () => ({
      error: { code: "INVALID_EMAIL_OR_PASSWORD", status: 401 },
    }));
    const { result, onSuccess } = renderSignIn(failing);
    act(() => result.current.setField("email", validEmail));
    act(() => result.current.setField("password", "wrong"));
    act(() => result.current.submit());
    await waitFor(() => expect(result.current.errorMessage).toBe(authCopy["error.unauthorized"]));
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("turns a thrown request into a connection message, not a crash", async () => {
    const throwing = vi.fn(async () => {
      throw new Error("offline");
    });
    const { result } = renderSignIn(throwing);
    act(() => result.current.setField("email", validEmail));
    act(() => result.current.setField("password", "secret"));
    act(() => result.current.submit());
    await waitFor(() => expect(result.current.errorMessage).toMatch(/connection/));
  });
});
