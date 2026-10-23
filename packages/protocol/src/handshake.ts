import { z } from "zod";
import { deviceDescriptionSchema } from "./device";

export const versionProbeSchema = z.object({ protocolVersion: z.int().positive() });

export const helloSchema = deviceDescriptionSchema.pick({
  protocolVersion: true,
  platform: true,
  appVersion: true,
  capabilities: true,
});

export const handshakeReplySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("welcome"), hello: helloSchema }),
  z.object({
    type: z.literal("refused"),
    reason: z.literal("protocol_version_mismatch"),
    protocolVersion: z.int().positive(),
  }),
]);

export const frameSchema = z.discriminatedUnion("type", [z.object({ type: z.literal("ready") })]);

export type Hello = z.infer<typeof helloSchema>;
export type HandshakeReply = z.infer<typeof handshakeReplySchema>;
export type Frame = z.infer<typeof frameSchema>;
