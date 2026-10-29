import { z } from "zod";

export const MAX_SPEAK_TEXT_CHARS = 200;
export const SPEAK_VOICES = ["default", "india"] as const;

export const speakRequestSchema = z.object({
  text: z.string().trim().min(1).max(MAX_SPEAK_TEXT_CHARS),
  voice: z.enum(SPEAK_VOICES),
});

export type SpeakVoice = (typeof SPEAK_VOICES)[number];
export type SpeakRequest = z.infer<typeof speakRequestSchema>;
