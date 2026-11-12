import type { HistoryEntry, HistoryStatus } from "@getahoy/protocol";
import { historyCopy } from "./historyCopy.ts";
import { seconds, totalMs } from "./historyTimings.ts";

export type StatusTone = "ink" | "kelp" | "flare" | "driftwood";

const statusTones: Record<HistoryStatus, StatusTone> = {
  running: "ink",
  done: "kelp",
  choice: "kelp",
  failed: "flare",
  blocked: "driftwood",
  cancelled: "driftwood",
};

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

export function canRunAgain(entry: HistoryEntry): boolean {
  return entry.status !== "blocked";
}

export function reportBody(note: string): { note?: string } {
  const trimmed = note.trim();
  return trimmed ? { note: trimmed } : {};
}

export function timingShare(ms: number, total: number, steps: number): number {
  return Math.min(steps, Math.max(1, Math.round((ms / total) * steps)));
}
