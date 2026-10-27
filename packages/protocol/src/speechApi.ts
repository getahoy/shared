import { z } from "zod";
import { MAX_COMMAND_TEXT_CHARS } from "./command";

export const AUDIO_UPLOAD_FIELD = "audio";
export const MAX_AUDIO_UPLOAD_BYTES = 2 * 1024 * 1024;

export const transcribeResponseSchema = z.object({
  text: z.string().min(1).max(MAX_COMMAND_TEXT_CHARS),
});

export type TranscribeResponse = z.infer<typeof transcribeResponseSchema>;
