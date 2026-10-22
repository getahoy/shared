import { useState } from "react";
import type { z } from "zod";
import { parseInput } from "../parseInput";
import type { AuthRequestState, AuthResponse } from "./useAuthRequest";

type CredentialsFormOptions<Input> = {
  schema: z.ZodType<Input>;
  request: (input: Input) => Promise<AuthResponse>;
  authRequest: AuthRequestState;
  onSuccess?: () => void;
};

export function useCredentialsForm<Input extends Record<string, string>>({
  schema,
  request,
  authRequest,
  onSuccess,
}: CredentialsFormOptions<Input>) {
  const [values, setValues] = useState<Partial<Input>>({});

  const setField = (name: keyof Input, text: string) =>
    setValues((current) => ({ ...current, [name]: text }));

  const submitForm = () => {
    const form = parseInput(schema, values);
    if (form.outcome === "invalid") return authRequest.showError(form.message);
    authRequest.submit(() => request(form.input), onSuccess);
  };

  return { values, setField, submit: submitForm };
}
