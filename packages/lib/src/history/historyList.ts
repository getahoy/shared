import type { HistoryEntry, HistoryQuery } from "@getahoy/protocol";
import type { EntryView } from "./entryMatches.ts";

export const HISTORY_STALE_MS = 30_000;

export const HISTORY_KEY = ["history"] as const;

export function historyKey({ filter, search, macKey }: EntryView) {
  return [...HISTORY_KEY, filter, search.trim(), macKey ?? null] as const;
}

export function queryOf(view: EntryView, cursor: string | null): HistoryQuery {
  const search = view.search.trim();
  return {
    status: view.filter,
    ...(search ? { q: search } : {}),
    ...(view.macKey ? { macKey: view.macKey } : {}),
    ...(cursor ? { cursor } : {}),
  };
}

type Paged<Page> = { pages: Page[] };

export function withoutEntries<Page extends { entries: HistoryEntry[] }, Pages extends Paged<Page>>(
  pages: Pages,
  keep: (entry: HistoryEntry) => boolean,
): Pages {
  const kept = pages.pages.map((page) => ({ ...page, entries: page.entries.filter(keep) }));
  return { ...pages, pages: kept };
}
