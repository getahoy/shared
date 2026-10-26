import { z } from "zod";

export const MAX_COMMAND_TEXT_CHARS = 500;
export const MAX_RESULT_MESSAGE_CHARS = 300;
export const COMMAND_STATUSES = ["done", "needsChoice", "refused", "failed"] as const;

const commandIdSchema = z.uuid();

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
  }),
] as const;

export type CommandFrame = z.infer<(typeof commandFrameSchemas)[number]>;
export type CommandStatus = (typeof COMMAND_STATUSES)[number];
