import {
  apiPaths,
  type HistoryQuery,
  type HistoryWrite,
  historyChangedSchema,
  historyPageSchema,
  historySettingsSchema,
  historyWrittenSchema,
} from "@getahoy/protocol";
import type { CallApi } from "../api/apiClient.ts";
import { reportNoteBody } from "./historyDisplay.ts";

function listParams({ status, cursor, macKey }: HistoryQuery) {
  return { status, ...(cursor ? { cursor } : {}), ...(macKey ? { macKey } : {}) };
}

const changed = historyChangedSchema;
const settings = historySettingsSchema;

// Search text goes in a body: request URLs end up in server access logs.
export function historyCalls(call: CallApi) {
  return {
    list: (query: HistoryQuery) =>
      query.q
        ? call({ path: apiPaths.historySearch, body: query, schema: historyPageSchema })
        : call({ path: apiPaths.history, query: listParams(query), schema: historyPageSchema }),
    write: (body: HistoryWrite) =>
      call({ path: apiPaths.history, body, schema: historyWrittenSchema }),
    remove: (id: string) =>
      call({ path: apiPaths.historyEntry(id), method: "DELETE", schema: changed }),
    restore: (id: string) =>
      call({ path: apiPaths.historyRestore(id), method: "POST", schema: changed }),
    report: (id: string, note: string) =>
      call({ path: apiPaths.historyReport(id), body: reportNoteBody(note), schema: changed }),
    clear: () => call({ path: apiPaths.history, method: "DELETE", schema: changed }),
    settings: () => call({ path: apiPaths.historySettings, schema: settings }),
    changeSettings: (keepHistory: boolean) =>
      call({
        path: apiPaths.historySettings,
        method: "PATCH",
        body: { keepHistory },
        schema: settings,
      }),
  };
}
