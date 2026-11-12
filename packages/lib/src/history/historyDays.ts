import type { HistoryEntry } from "@getahoy/protocol";
import { historyCopy } from "./historyCopy.ts";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAY_WINDOW_DAYS = 6;

export type HistorySection = { title: string; data: HistoryEntry[] };

function startOfDay(at: Date): number {
  return new Date(at.getFullYear(), at.getMonth(), at.getDate()).getTime();
}

export function dayLabel(at: Date, now: Date): string {
  const daysAgo = Math.round((startOfDay(now) - startOfDay(at)) / DAY_MS);
  if (daysAgo === 0) return historyCopy.today;
  if (daysAgo === 1) return historyCopy.yesterday;
  if (daysAgo <= WEEKDAY_WINDOW_DAYS) {
    return at.toLocaleDateString(undefined, { weekday: "long" });
  }
  const sameYear = at.getFullYear() === now.getFullYear();
  return at.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

export function timeLabel(at: Date): string {
  return at.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function sectionsByDay(entries: readonly HistoryEntry[], now: Date): HistorySection[] {
  const sections: HistorySection[] = [];
  for (const entry of entries) {
    const title = dayLabel(new Date(entry.startedAt), now);
    const last = sections.at(-1);
    if (last?.title === title) last.data.push(entry);
    else sections.push({ title, data: [entry] });
  }
  return sections;
}
