import { authCopy } from "./authCopy.ts";

export const credentialFields = {
  name: { name: "name", label: authCopy["field.name"], autoComplete: "name" },
  email: { name: "email", label: authCopy["field.email"], autoComplete: "email" },
  currentPassword: {
    name: "password",
    label: authCopy["field.password"],
    autoComplete: "current-password",
  },
  newPassword: {
    name: "password",
    label: authCopy["field.password"],
    autoComplete: "new-password",
  },
} as const;
