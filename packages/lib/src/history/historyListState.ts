import type { HistoryFilter, HistoryPage } from "@getahoy/protocol";
import { historyCopy } from "./historyCopy.ts";
import { summaryLine } from "./historyDisplay.ts";

export type ListPhase = "loading" | "ready" | "failed";

export type BlankKind =
  | "loading"
  | "off"
  | "signedOut"
  | "error"
  | "cleared"
  | "noMatch"
  | "nothingFailed"
  | "nothingDone"
  | "empty";

export type ShownBlank = Exclude<BlankKind, "loading">;

type BlankInput = {
  phase: ListPhase;
  keepHistory: boolean | null;
  signedOut: boolean;
  cleared: boolean;
  count: number;
  filter: HistoryFilter;
  search: string;
};

export function blankFor(input: BlankInput): BlankKind | null {
  if (input.keepHistory === false) return "off";
  if (input.count > 0) return null;
  if (input.phase === "loading") return "loading";
  if (input.phase === "failed") return input.signedOut ? "signedOut" : "error";
  if (input.search.trim()) return "noMatch";
  if (input.filter === "failed") return "nothingFailed";
  if (input.filter === "done") return "nothingDone";
  return input.cleared ? "cleared" : "empty";
}

type BlankCopy = { eyebrow?: string; title: string; body?: string };

type AppBodies = { emptyBody: string; offBody: string; signedOutBody?: string };

export function blankCopy(kind: ShownBlank, search: string, bodies: AppBodies): BlankCopy {
  const { errorTitle, errorBody } = historyCopy;
  const blanks: Record<ShownBlank, BlankCopy> = {
    off: { title: historyCopy.offTitle, body: bodies.offBody },
    signedOut: { title: errorTitle, body: bodies.signedOutBody ?? errorBody },
    error: { title: errorTitle, body: errorBody },
    cleared: {
      eyebrow: historyCopy.clearedEyebrow,
      title: historyCopy.clearedTitle,
      body: historyCopy.clearedBody,
    },
    noMatch: { title: historyCopy.noMatchTitle(search.trim()), body: historyCopy.noMatchBody },
    nothingFailed: { title: historyCopy.nothingFailedTitle, body: historyCopy.nothingFailedBody },
    nothingDone: { title: historyCopy.nothingDoneTitle },
    empty: { title: historyCopy.emptyTitle, body: bodies.emptyBody },
  };
  return blanks[kind];
}

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

function noticeOf({ offline, stale, manualFailure }: ListViewInput) {
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
