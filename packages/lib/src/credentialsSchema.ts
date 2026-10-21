import { z } from "zod";

export const MINIMUM_PASSWORD_LENGTH = 8;
export const MAXIMUM_PASSWORD_LENGTH = 128;

export type CredentialsMessages = {
  name: string;
  email: string;
  password: string;
  passwordMinLength: string;
  passwordMaxLength: string;
};

export function credentialsSchemas(messages: CredentialsMessages) {
  const email = z.email(messages.email);
  return {
    signInSchema: z.object({
      email,
      password: z.string().min(1, messages.password),
    }),
    signUpSchema: z.object({
      name: z.string().trim().min(1, messages.name),
      email,
      password: z
        .string()
        .min(MINIMUM_PASSWORD_LENGTH, messages.passwordMinLength)
        .max(MAXIMUM_PASSWORD_LENGTH, messages.passwordMaxLength),
    }),
  };
}

type CredentialsSchemas = ReturnType<typeof credentialsSchemas>;

export type SignInInput = z.infer<CredentialsSchemas["signInSchema"]>;
export type SignUpInput = z.infer<CredentialsSchemas["signUpSchema"]>;
