import type { ErrorCode } from "../errorCodes.ts";
import type { RequestError } from "./request.ts";

export type FailureKind =
  | "offline"
  | "signedOut"
  | "updateNeeded"
  | "rateLimited"
  | "notFound"
  | "conflict"
  | "server"
  | "refused";

function failureOfCode(code: ErrorCode): FailureKind {
  switch (code) {
    case "transient":
    case "internal":
    case "broken":
      return "server";
    case "not_found":
      return "notFound";
    case "conflict":
      return "conflict";
    case "rate_limited":
      return "rateLimited";
    case "unauthorized":
      return "signedOut";
    case "protocol_version_mismatch":
      return "updateNeeded";
    case "forbidden":
    case "invalid_input":
    case "device_revoked":
    case "blocked":
    case "nothing_heard":
      return "refused";
    default: {
      const unhandled: never = code;
      return unhandled;
    }
  }
}

export function failureKind(error: RequestError): FailureKind {
  switch (error.kind) {
    case "network":
      return "offline";
    case "malformed":
      return "server";
    case "api":
      return failureOfCode(error.detail.code);
    default: {
      const unhandled: never = error;
      return unhandled;
    }
  }
}
