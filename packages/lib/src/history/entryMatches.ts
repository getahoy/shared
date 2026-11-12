import { type HistoryEntry, type HistoryFilter, statusesShownBy } from "@getahoy/protocol";

export type EntryView = {
  filter: HistoryFilter;
  search: string;
  macKey?: string | null;
};

export function entryMatches(entry: HistoryEntry, view: EntryView): boolean {
  const statuses = statusesShownBy(view.filter);
  if (statuses && !statuses.includes(entry.status)) return false;
  if (view.macKey && entry.macKey !== view.macKey) return false;
  const words = view.search.trim().toLowerCase();
  if (!words) return true;
  const text = [entry.heard, entry.did ?? "", entry.app ?? ""].join(" ");
  return text.toLowerCase().includes(words);
}
