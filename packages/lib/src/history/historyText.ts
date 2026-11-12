import type { FailureReason, HistoryEntry, HistoryFilter, HistoryPage } from "@getahoy/protocol";
import { historyCopy } from "./historyCopy.ts";
import { seconds, timingSegments } from "./historyTimings.ts";

type WhyCopy = Readonly<Record<FailureReason, string>>;

export function reportLines(entry: HistoryEntry) {
  const timings = timingSegments(entry.timings)
    .map((segment) => `${segment.label} ${seconds(segment.ms)}s`)
    .join(" · ");
  const fields = historyCopy.reportFields;
  const lines: [string, string | null][] = [
    [fields.heard, entry.heard],
    [fields.did, entry.did],
    [fields.status, entry.status],
    [fields.app, entry.app],
    [fields.reason, entry.reason],
    [fields.timings, timings || null],
  ];
  return lines.flatMap(([label, text]) => (text ? [{ label, text }] : []));
}

export function summaryLine(filter: HistoryFilter, summary: HistoryPage["summary"]): string | null {
  return summary ? historyCopy.summary[filter](summary) : null;
}

export function whyOf(entry: HistoryEntry, why: WhyCopy) {
  switch (entry.status) {
    case "failed":
      return { label: historyCopy.whyFailed, text: why[entry.reason ?? "other"] };
    case "blocked":
      return { label: historyCopy.whyBlocked, text: why[entry.reason ?? "blockedApp"] };
    case "cancelled":
      return { label: historyCopy.whyCancelled, text: historyCopy.cancelledWhy };
    case "running":
    case "done":
    case "choice":
      return null;
    default: {
      const unhandled: never = entry.status;
      return unhandled;
    }
  }
}
