const HISTORY = "/api/history";

const historyEntry = (id: string) => `${HISTORY}/${encodeURIComponent(id)}`;

export const apiPaths = {
  history: HISTORY,
  historySearch: `${HISTORY}/search`,
  historySettings: `${HISTORY}/settings`,
  historyEntry,
  historyReport: (id: string) => `${historyEntry(id)}/report`,
  historyRestore: (id: string) => `${historyEntry(id)}/restore`,
  pairingLinks: "/api/pairing/links",
  pairingUnlink: "/api/pairing/unlink",
  pairingClaim: "/api/pairing/claim",
  pairingComplete: "/api/pairing/complete",
  speak: "/api/speak",
  transcribe: "/api/transcribe",
  interpret: "/api/interpret",
} as const;
