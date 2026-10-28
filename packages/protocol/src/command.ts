import { z } from "zod";

export const MAX_COMMAND_TEXT_CHARS = 500;
export const MAX_RESULT_MESSAGE_CHARS = 300;
export const MAX_CHOICES = 20;
export const MAX_CHOICE_LABEL_CHARS = 80;
export const CHOICE_TTL_MS = 20_000;
export const COMMAND_STATUSES = ["done", "needsChoice", "refused", "failed"] as const;

const commandIdSchema = z.uuid();

const choiceSchema = z.object({
  number: z.int().min(1).max(MAX_CHOICES),
  label: z.string().max(MAX_CHOICE_LABEL_CHARS),
});

export const commandFrameSchemas = [
  z.object({
    type: z.literal("command"),
    commandId: commandIdSchema,
    text: z.string().min(1).max(MAX_COMMAND_TEXT_CHARS),
  }),
  z.object({ type: z.literal("command.received"), commandId: commandIdSchema }),
  z.object({
    type: z.literal("command.result"),
    commandId: commandIdSchema,
    status: z.enum(COMMAND_STATUSES),
    message: z.string().max(MAX_RESULT_MESSAGE_CHARS),
    choices: z.array(choiceSchema).max(MAX_CHOICES).default([]),
    confirm: z.boolean().default(false),
  }),
  z.object({
    type: z.literal("command.choose"),
    commandId: commandIdSchema,
    parentId: commandIdSchema,
    number: z.int().min(1).max(MAX_CHOICES),
  }),
] as const;

export type CommandFrame = z.infer<(typeof commandFrameSchemas)[number]>;
export type CommandStatus = (typeof COMMAND_STATUSES)[number];
export type CommandChoice = z.infer<typeof choiceSchema>;
