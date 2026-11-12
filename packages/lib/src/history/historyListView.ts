import type { HistoryFilter, HistoryPage } from "@getahoy/protocol";
import type { BlankKind } from "./historyBlank.ts";
import { summaryLine } from "./historyText.ts";

export type ListNotice = "offline" | "couldNotRefresh" | null;

type ListViewInput = {
  blank: BlankKind | null;
  filter: HistoryFilter;
  search: string;
  count: number;
  summary: HistoryPage["summary"];
  summaryPending: boolean;
  offline: boolean;
  stale: boolean;
  manualFailure: boolean;
};

const NO_HISTORY: readonly (BlankKind | null)[] = ["empty", "cleared", "off"];

function noticeOf({ offline, stale, manualFailure }: ListViewInput): ListNotice {
  if (offline) return "offline";
  return stale && !manualFailure ? "couldNotRefresh" : null;
}

export function listView(input: ListViewInput) {
  const noHistory = NO_HISTORY.includes(input.blank);
  const plain = input.filter === "all" && !input.search.trim();
  return {
    summary: noHistory ? null : summaryLine(input.filter, input.summary),
    summaryPending: !noHistory && !input.summary && input.summaryPending,
    canClear: plain && input.count > 0,
    notice: noticeOf(input),
  };
}
