import { z } from "zod";
import {
  choiceSchema,
  FAILURE_REASONS,
  MAX_APP_NAME_CHARS,
  MAX_CHOICES,
  MAX_COMMAND_TEXT_CHARS,
  MAX_RESULT_MESSAGE_CHARS,
  UNDERSTOOD_BY,
} from "./command.ts";
import { bytes32Schema } from "./device.ts";

export const HISTORY_STATUSES = [
  "running",
  "done",
  "choice",
  "failed",
  "blocked",
  "cancelled",
] as const;
export const HISTORY_FILTERS = ["all", "done", "failed"] as const;
export const MAX_HISTORY_WRITES = 20;
export const MAX_FOLLOW_UPS = 5;
export const HISTORY_PAGE_SIZE = 30;
export const MAX_REPORT_NOTE_CHARS = 500;
const MAX_MAC_NAME_CHARS = 64;
const MAX_SEARCH_CHARS = 100;
const MAX_CURSOR_CHARS = 200;

export type HistoryStatus = (typeof HISTORY_STATUSES)[number];
const STATUSES_WITH_REASON: readonly HistoryStatus[] = ["failed", "blocked", "cancelled"];

const durationSchema = z.int().min(0);
const momentSchema = z.iso.datetime({ offset: true });

export const historyTimingsSchema = z.object({
  hearingMs: durationSchema.optional(),
  understandingMs: durationSchema.optional(),
  onMacMs: durationSchema.optional(),
  waitedMs: durationSchema.optional(),
});

export const historyFollowUpSchema = z.object({
  question: z.string().max(MAX_RESULT_MESSAGE_CHARS),
  options: z.array(choiceSchema).max(MAX_CHOICES),
  chosen: z.int().min(1).max(MAX_CHOICES).nullable(),
  said: z.string().max(MAX_COMMAND_TEXT_CHARS).nullable(),
  waitedMs: durationSchema.nullable(),
});

const entryFields = {
  id: z.uuid(),
  macName: z.string().trim().min(1).max(MAX_MAC_NAME_CHARS),
  heard: z.string().min(1).max(MAX_COMMAND_TEXT_CHARS),
  did: z.string().max(MAX_RESULT_MESSAGE_CHARS).nullable(),
  status: z.enum(HISTORY_STATUSES),
  app: z.string().max(MAX_APP_NAME_CHARS).nullable(),
  via: z.enum(UNDERSTOOD_BY).nullable(),
  reason: z.enum(FAILURE_REASONS).nullable(),
  timings: historyTimingsSchema,
  followUps: z.array(historyFollowUpSchema).max(MAX_FOLLOW_UPS),
  startedAt: momentSchema,
  finishedAt: momentSchema.nullable(),
};

export const historyEntrySchema = z.object({ ...entryFields, macKey: bytes32Schema.nullable() });

const historyWriteEntrySchema = z
  .object({ ...entryFields, macKey: bytes32Schema, rev: z.int().min(0) })
  .refine((entry) => entry.reason === null || STATUSES_WITH_REASON.includes(entry.status), {
    message: "Only failed, blocked or cancelled entries carry a reason",
    path: ["reason"],
  })
  .refine((entry) => (entry.status === "running") === (entry.finishedAt === null), {
    message: "Only a running entry has no finish time",
    path: ["finishedAt"],
  });

export const historyWriteSchema = z.object({
  phoneKey: bytes32Schema,
  entries: z.array(historyWriteEntrySchema).min(1).max(MAX_HISTORY_WRITES),
});

export const historyWrittenSchema = z.object({ saved: z.int().min(0) });

export const historyQuerySchema = z.object({
  cursor: z.string().max(MAX_CURSOR_CHARS).optional(),
  status: z.enum(HISTORY_FILTERS).default("all"),
  q: z.string().trim().max(MAX_SEARCH_CHARS).optional(),
  macKey: bytes32Schema.optional(),
});

export const historyPageSchema = z.object({
  entries: z.array(historyEntrySchema),
  cursor: z.string().nullable(),
  summary: z
    .object({
      lastSevenDays: z.int().min(0),
      wentThrough: z.int().min(0).optional(),
      didntGoThrough: z.int().min(0),
    })
    .nullable(),
});

export const historySettingsSchema = z.object({ keepHistory: z.boolean() });

export const problemReportRequestSchema = z.object({
  note: z.string().trim().max(MAX_REPORT_NOTE_CHARS).optional(),
});

export const historyChangedSchema = z.object({ changed: z.literal(true) });

export type HistoryEntry = z.infer<typeof historyEntrySchema>;
export type HistoryFilter = (typeof HISTORY_FILTERS)[number];
export type HistoryFollowUp = z.infer<typeof historyFollowUpSchema>;
export type HistoryPage = z.infer<typeof historyPageSchema>;
export type HistoryQuery = z.infer<typeof historyQuerySchema>;
export type HistorySettings = z.infer<typeof historySettingsSchema>;
export type HistoryTimings = z.infer<typeof historyTimingsSchema>;
export type HistoryWrite = z.infer<typeof historyWriteSchema>;
export type HistoryWriteEntry = HistoryWrite["entries"][number];
