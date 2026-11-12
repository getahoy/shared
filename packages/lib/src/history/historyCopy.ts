import {
  HISTORY_RETENTION_DAYS,
  HISTORY_SUMMARY_DAYS,
  type HistoryFilter,
  type HistoryPage,
  type HistoryStatus,
} from "@getahoy/protocol";

type SummaryCounts = NonNullable<HistoryPage["summary"]>;

const SUMMARY_WINDOW = `in the last ${HISTORY_SUMMARY_DAYS} days`;
const KEEPS_HISTORY = `Ahoy keeps a history of what you said and what it did in your account for ${HISTORY_RETENTION_DAYS} days.`;
const NO_AUDIO = "Speech audio is never stored.";

export const historyCopy = {
  title: "History",
  summary: {
    all: ({ lastSevenDays, didntGoThrough }: SummaryCounts) =>
      didntGoThrough > 0
        ? `${lastSevenDays} ${SUMMARY_WINDOW} · ${didntGoThrough} didn’t go through`
        : `${lastSevenDays} ${SUMMARY_WINDOW}`,
    done: ({ wentThrough }: SummaryCounts) =>
      wentThrough === undefined ? null : `${wentThrough} went through ${SUMMARY_WINDOW}`,
    failed: ({ didntGoThrough }: SummaryCounts) =>
      `${didntGoThrough} didn’t go through ${SUMMARY_WINDOW}`,
  } satisfies Record<HistoryFilter, (counts: SummaryCounts) => string | null>,
  keepHistoryDisclosure: (howToChange: string | null) =>
    [KEEPS_HISTORY, howToChange, NO_AUDIO].filter((part) => part !== null).join(" "),
  clearBody: "This deletes every entry, on your iPhone and on your Macs. It can’t be undone.",
  couldNotChange: "Couldn’t change that. Try again.",
  signedOutBody: "Sign in to see your history.",
  nothingDoneTitle: "Nothing went through yet.",
  nothingDoneBody: "",
  searchPlaceholder: "Search what you said",
  searchLabel: "Search history",
  clearSearch: "Clear search",
  filterLabel: "Filter",
  filters: { all: "All", done: "Done", failed: "Failed" },
  today: "Today",
  yesterday: "Yesterday",
  couldNotRefresh: "Couldn’t refresh",
  emptyTitle: "Nothing here yet.",
  loading: "Loading your history…",
  loadingSlow: "Still loading your history…",
  loadingSlowHint: "This can take a moment on a slow connection.",
  errorTitle: "Couldn’t load your history.",
  errorBody: "Your entries are safe. Check your connection and try again.",
  tryAgain: "Try again",
  clearedEyebrow: "Just now",
  clearedTitle: "History cleared.",
  clearedBody: "New commands will show up here.",
  noMatchTitle: (query: string) => `Nothing matches “${query}”.`,
  noMatchBody: "Search looks at what you said and what Ahoy did.",
  nothingFailedTitle: "Nothing failed.",
  nothingFailedBody: "Every command went through.",
  offTitle: "History is off.",
  keepHistory: "Keep history",
  clearHistory: "Clear history…",
  clearTitle: "Clear all history?",
  clearConfirm: "Clear history",
  cancel: "Cancel",
  couldNotClear: "Couldn’t clear your history. Try again.",
  status: {
    running: "Running",
    done: "Done",
    choice: "Asked you, then done",
    failed: "Didn’t work",
    blocked: "Blocked",
    cancelled: "Cancelled",
  } satisfies Record<HistoryStatus, string>,
  ahoyAsked: "Ahoy asked",
  youSaid: (seconds: string | null) => (seconds ? `You said · after ${seconds}s` : "You said"),
  where: (app: string | null, seconds: string | null) =>
    [app ? `In ${app}` : null, seconds ? `${seconds}s` : null]
      .filter((part) => part !== null)
      .join(" · "),
  whyFailed: "Why it didn’t work",
  whyBlocked: "Why Ahoy stopped",
  whyCancelled: "What happened",
  timeWent: "Where the time went",
  hearing: "Hearing you",
  understanding: "Understanding",
  onMac: "On the Mac",
  waitedNote: (seconds: string) => `The ${seconds}s Ahoy waited for your answer isn’t counted.`,
  understoodBy: "Understood by",
  viaAi: "Smart (AI)",
  viaAiNote: "Your words were sent to Ahoy’s AI to work out what you meant.",
  viaRules: "Built-in rules",
  confirmRunTitle: "Run this again?",
  confirmRunBody: (heard: string) => `“${heard}” can close an app or open an email draft.`,
  confirmRun: "Run again",
  report: "Report a problem",
  reportBody: "This is exactly what will be sent. Nothing else is attached.",
  reportNote: "Add a note (optional)",
  reportSend: "Send report",
  reportSent: "Thanks. We’ll look at this one.",
  couldNotReport: "Couldn’t send the report. Try again.",
  reportFields: {
    heard: "What you said",
    did: "What Ahoy did",
    status: "Status",
    app: "App",
    reason: "Reason",
    timings: "Timings",
  },
  copy: "Copy",
  copied: "Copied",
  delete: "Delete",
  deleted: "Deleted",
  undo: "Undo",
  couldNotDelete: "Couldn’t delete that entry. Try again.",
  couldNotUndo: "Couldn’t undo",
  copiedText: (heard: string, did: string | null) => (did ? `“${heard}” → ${did}` : `“${heard}”`),
  cancelledWhy:
    "Ahoy asked you something and the question closed before an answer, so nothing was changed.",
} as const;
