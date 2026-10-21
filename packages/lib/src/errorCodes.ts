const errorCodes = [
  "invalid_input",
  "unauthorized",
  "forbidden",
  "not_found",
  "conflict",
  "rate_limited",
  "device_revoked",
  "protocol_version_mismatch",
  "blocked",
  "transient",
  "broken",
  "internal",
] as const;

export type ErrorCode = (typeof errorCodes)[number];

export const errorMessages: Record<ErrorCode, string> = {
  invalid_input: "Check the details and try again.",
  unauthorized: "Sign in to continue.",
  forbidden: "You do not have access to this.",
  not_found: "We could not find that.",
  conflict: "That already exists.",
  rate_limited: "Too many attempts. Wait a moment and try again.",
  device_revoked: "This device was removed from your account.",
  protocol_version_mismatch: "Update the app to continue.",
  blocked: "That action is not allowed.",
  transient: "Could not reach the server. Check your connection and try again.",
  broken: "Something is wrong on our side. Try again later.",
  internal: "Something went wrong. Try again.",
};
