import type {
  FailureReason,
  HistoryEntry,
  HistoryFilter,
  HistoryPage,
  HistoryStatus,
} from "@getahoy/protocol";
import { historyCopy } from "./historyCopy.ts";
import { seconds, timingSegments, totalMs } from "./historyTimings.ts";

type WhyCopy = Readonly<Record<FailureReason, string>>;

export type StatusTone = "ink" | "kelp" | "flare" | "driftwood";

const statusTones: Record<HistoryStatus, StatusTone> = {
  running: "ink",
  done: "kelp",
  choice: "kelp",
  failed: "flare",
  blocked: "driftwood",
  cancelled: "driftwood",
};

// History keeps the words, not the action, so the words decide what deserves a second look.
const RISKY_WORDS = /\b(?:close|quit|exit|e-?mail|mail|draft)\b/i;

export function statusTone(status: HistoryStatus): StatusTone {
  return statusTones[status];
}

export function rowDid(entry: HistoryEntry, working: string): string {
  if (entry.status === "running") return working;
  return entry.did ?? historyCopy.status[entry.status];
}

export function whereLine(entry: HistoryEntry): string {
  const total = totalMs(entry.timings);
  return historyCopy.where(entry.app, total === null ? null : seconds(total));
}

export function summaryLine(filter: HistoryFilter, summary: HistoryPage["summary"]): string | null {
  return summary ? historyCopy.summary[filter](summary) : null;
}

export function canRunAgain(entry: HistoryEntry): boolean {
  return entry.status !== "blocked";
}

export function needsRunConfirm(heard: string): boolean {
  return RISKY_WORDS.test(heard);
}

export function reportNoteBody(note: string): { note?: string } {
  const trimmed = note.trim();
  return trimmed ? { note: trimmed } : {};
}

export function timingShare(ms: number, total: number, steps: number): number {
  return Math.min(steps, Math.max(1, Math.round((ms / total) * steps)));
}

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
