import { z } from "zod";

export const MAX_FRAME_BYTES = 64 * 1024;
export const MAX_AUDIO_CHUNK_BYTES = 32 * 1024;
export const MAX_RECORDING_MS = 30_000;
export const SPEECH_SAMPLE_RATE = 16_000;
export const AUDIO_FORMATS = ["pcm_s16le"] as const;
export const AUDIO_REJECT_REASONS = ["locked", "tooLong", "badAudio", "replaced"] as const;

const BASE64_BITS_PER_CHAR = 6;
const BITS_PER_BYTE = 8;
const MAX_AUDIO_CHUNK_CHARS = Math.ceil(
  (MAX_AUDIO_CHUNK_BYTES * BITS_PER_BYTE) / BASE64_BITS_PER_CHAR,
);

const commandIdSchema = z.uuid();
const durationMsSchema = z.int().nonnegative();

export const audioFrameSchemas = [
  z.object({
    type: z.literal("audio.start"),
    commandId: commandIdSchema,
    format: z.enum(AUDIO_FORMATS),
    sampleRate: z.int().positive(),
    channels: z.literal(1),
  }),
  z.object({
    type: z.literal("audio.chunk"),
    commandId: commandIdSchema,
    seq: z.int().nonnegative(),
    data: z.base64url().max(MAX_AUDIO_CHUNK_CHARS),
  }),
  z.object({
    type: z.literal("audio.end"),
    commandId: commandIdSchema,
    chunkCount: z.int().nonnegative(),
    durationMs: durationMsSchema,
  }),
  z.object({ type: z.literal("audio.cancel"), commandId: commandIdSchema }),
  z.object({
    type: z.literal("audio.received"),
    commandId: commandIdSchema,
    durationMs: durationMsSchema,
  }),
  z.object({
    type: z.literal("audio.rejected"),
    commandId: commandIdSchema,
    reason: z.enum(AUDIO_REJECT_REASONS),
  }),
] as const;

export const PCM_BYTES_PER_SAMPLE = 2;
const MS_PER_SECOND = 1000;

export function pcmDurationMs(byteLength: number, sampleRate: number): number {
  return Math.round((byteLength / PCM_BYTES_PER_SAMPLE / sampleRate) * MS_PER_SECOND);
}

export function pcmBytesFor(durationMs: number, sampleRate: number): number {
  return Math.floor((durationMs / MS_PER_SECOND) * sampleRate) * PCM_BYTES_PER_SAMPLE;
}

export type AudioFrame = z.infer<(typeof audioFrameSchemas)[number]>;
export type AudioFormat = (typeof AUDIO_FORMATS)[number];
export type AudioRejectReason = (typeof AUDIO_REJECT_REASONS)[number];
