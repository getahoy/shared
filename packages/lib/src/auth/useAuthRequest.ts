import { useState, useTransition } from "react";
import { type AuthError, authErrorMessage } from "./authErrorMessage";

export type AuthResponse = { error: AuthError | null };

const NETWORK_FAILURE: AuthResponse = { error: { status: 0 } };

function networkFailureOnly(error: unknown): AuthResponse {
  if (error instanceof TypeError) return NETWORK_FAILURE;
  throw error;
}

export function useAuthRequest() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (request: () => Promise<AuthResponse>, onSuccess?: () => void) =>
    startTransition(async () => {
      setErrorMessage(null);
      const { error } = await request().catch(networkFailureOnly);
      if (error) return setErrorMessage(authErrorMessage(error));
      onSuccess?.();
    });

  return { pending, errorMessage, submit, showError: setErrorMessage };
}
