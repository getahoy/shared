import { authCopy } from "./authCopy.ts";

export const socialProviderCatalog = [{ id: "google", label: authCopy["social.google"] }] as const;

export type SocialProviderId = (typeof socialProviderCatalog)[number]["id"];
