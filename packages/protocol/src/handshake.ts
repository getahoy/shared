import { z } from "zod";
import { commandFrameSchemas } from "./command";
import { deviceDescriptionSchema } from "./device";

export const versionProbeSchema = z.object({ protocolVersion: z.int().positive() });

export const helloSchema = deviceDescriptionSchema.pick({
  protocolVersion: true,
  platform: true,
  appVersion: true,
  capabilities: true,
});

export const END_REASONS = ["removed", "replaced", "signed_out"] as const;

export const endReasonSchema = z.enum(END_REASONS);

export const goodbyeReasonSchema = z.enum([
  ...END_REASONS,
  "paused",
  "turned_off",
  "quitting",
  "sleeping",
]);

export const handshakeReplySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("welcome"), hello: helloSchema }),
  z.object({
    type: z.literal("version_mismatch"),
    protocolVersion: z.int().positive(),
  }),
  z.object({
    type: z.literal("not_paired"),
    detail: z.enum([...END_REASONS, "unknown"]),
  }),
]);

export const unknownMacKeySchema = z.object({ type: z.literal("unknown_mac_key") });

export const frameSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("ready") }),
  z.object({ type: z.literal("goodbye"), reason: goodbyeReasonSchema }),
  z.object({ type: z.literal("status"), locked: z.boolean() }),
  z.object({ type: z.literal("ping") }),
  z.object({ type: z.literal("pong") }),
  ...commandFrameSchemas,
]);

export type Hello = z.infer<typeof helloSchema>;
export type EndReason = z.infer<typeof endReasonSchema>;
export type GoodbyeReason = z.infer<typeof goodbyeReasonSchema>;
export type HandshakeReply = z.infer<typeof handshakeReplySchema>;
export type Frame = z.infer<typeof frameSchema>;
