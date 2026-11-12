import type { CommandStatus, FailureReason } from "./command.ts";
import type { HistoryFilter, HistoryStatus } from "./historyApi.ts";

export const WENT_THROUGH: readonly HistoryStatus[] = ["done", "choice"];

export const DID_NOT_GO_THROUGH: readonly HistoryStatus[] = ["failed", "blocked"];

export function statusesShownBy(filter: HistoryFilter): readonly HistoryStatus[] | null {
  switch (filter) {
    case "all":
      return null;
    case "done":
      return WENT_THROUGH;
    case "failed":
      return DID_NOT_GO_THROUGH;
    default: {
      const unhandled: never = filter;
      return unhandled;
    }
  }
}

export function historyStatusOf(status: CommandStatus, followedUp: boolean): HistoryStatus {
  switch (status) {
    case "done":
      return followedUp ? "choice" : "done";
    case "needsChoice":
      return "running";
    case "refused":
      return "blocked";
    case "failed":
      return "failed";
    default: {
      const unhandled: never = status;
      return unhandled;
    }
  }
}

export function historyReasonOf(
  status: HistoryStatus,
  reason: FailureReason | null | undefined,
): FailureReason | null {
  return DID_NOT_GO_THROUGH.includes(status) ? (reason ?? "other") : null;
}
