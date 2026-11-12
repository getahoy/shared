import { z } from "zod";

export const MAX_COMMAND_TEXT_CHARS = 500;
export const MAX_RESULT_MESSAGE_CHARS = 300;
export const MAX_SPEECH_CHARS = 140;
export const MAX_CHOICES = 20;
export const MAX_CHOICE_LABEL_CHARS = 80;
export const CHOICE_TTL_MS = 20_000;
export const COMMAND_STATUSES = ["done", "needsChoice", "refused", "failed"] as const;
export const SPEAK_TARGETS = ["phone", "mac", "both", "off"] as const;
export const UNDERSTOOD_BY = ["rules", "ai"] as const;
export const FAILURE_REASONS = [
  "macUnreachable",
  "noAnswer",
  "nothingHeard",
  "transcribeFailed",
  "unknownApp",
  "nothingSelected",
  "targetNotFound",
  "blockedApp",
  "screenChanged",
  "offline",
  "other",
] as const;
export const MAX_APP_NAME_CHARS = 60;
// A Mac without it closes the session on a command.lookup frame.
export const COMMAND_LOOKUP_CAPABILITY = "commandLookup";

const commandIdSchema = z.uuid();

export const choiceSchema = z.object({
  number: z.int().min(1).max(MAX_CHOICES),
  label: z.string().max(MAX_CHOICE_LABEL_CHARS),
});

export const commandFrameSchemas = [
  z.object({
    type: z.literal("command"),
    commandId: commandIdSchema,
    text: z.string().min(1).max(MAX_COMMAND_TEXT_CHARS),
    speakOn: z.enum(SPEAK_TARGETS).default("phone"),
  }),
  z.object({ type: z.literal("command.received"), commandId: commandIdSchema }),
  z.object({
    type: z.literal("command.result"),
    commandId: commandIdSchema,
    threadId: commandIdSchema,
    status: z.enum(COMMAND_STATUSES),
    message: z.string().max(MAX_RESULT_MESSAGE_CHARS),
    speech: z.string().min(1).max(MAX_SPEECH_CHARS).optional(),
    choices: z.array(choiceSchema).max(MAX_CHOICES).default([]),
    confirm: z.boolean().default(false),
    app: z.string().max(MAX_APP_NAME_CHARS).optional(),
    via: z.enum(UNDERSTOOD_BY).optional(),
    onMacMs: z.int().min(0).optional(),
    reason: z.enum(FAILURE_REASONS).optional(),
  }),
  z.object({
    type: z.literal("command.choose"),
    commandId: commandIdSchema,
    parentId: commandIdSchema,
    number: z.int().min(1).max(MAX_CHOICES),
  }),
  z.object({ type: z.literal("speech.stop") }),
  z.object({ type: z.literal("choice.extend"), choiceId: commandIdSchema }),
  z.object({ type: z.literal("command.lookup"), commandId: commandIdSchema }),
  z.object({ type: z.literal("command.unknown"), commandId: commandIdSchema }),
] as const;

export type CommandFrame = z.infer<(typeof commandFrameSchemas)[number]>;
export type CommandStatus = (typeof COMMAND_STATUSES)[number];
export type CommandChoice = z.infer<typeof choiceSchema>;
export type SpeakTarget = (typeof SPEAK_TARGETS)[number];
export type FailureReason = (typeof FAILURE_REASONS)[number];
export type UnderstoodBy = (typeof UNDERSTOOD_BY)[number];
