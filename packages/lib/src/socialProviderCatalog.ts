export const socialProviderCatalog = [{ id: "google", label: "Continue with Google" }] as const;

export type SocialProviderId = (typeof socialProviderCatalog)[number]["id"];
