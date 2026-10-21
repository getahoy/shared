import { z } from "zod";
import { authCopy } from "./authCopy";

export const MINIMUM_PASSWORD_LENGTH = 8;
export const MAXIMUM_PASSWORD_LENGTH = 128;

const email = z.email(authCopy["validation.email"]);

const passwordMinLengthMessage = authCopy["validation.passwordMinLength"].replace(
  "{minimum}",
  String(MINIMUM_PASSWORD_LENGTH),
);

const passwordMaxLengthMessage = authCopy["validation.passwordMaxLength"].replace(
  "{maximum}",
  String(MAXIMUM_PASSWORD_LENGTH),
);

export const signInSchema = z.object({
  email,
  password: z.string().min(1, authCopy["validation.password"]),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, authCopy["validation.name"]),
  email,
  password: z
    .string()
    .min(MINIMUM_PASSWORD_LENGTH, passwordMinLengthMessage)
    .max(MAXIMUM_PASSWORD_LENGTH, passwordMaxLengthMessage),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
