import { z } from "zod";

export const PROTOCOL_VERSION = 1;

const ENCODED_32_BYTES_LENGTH = 43;
const MAXIMUM_NAME_LENGTH = 64;
const MAXIMUM_CAPABILITIES = 32;

export const bytes32Schema = z.base64url().length(ENCODED_32_BYTES_LENGTH);

export const PLATFORMS = ["macos", "windows", "linux", "ios", "android"] as const;

export const platformSchema = z.enum(PLATFORMS);

export const deviceDescriptionSchema = z.object({
  publicKey: bytes32Schema,
  displayName: z
    .string()
    .trim()
    .min(1)
    .transform((name) => name.slice(0, MAXIMUM_NAME_LENGTH)),
  platform: platformSchema,
  platformVersion: z.string().max(MAXIMUM_NAME_LENGTH),
  appVersion: z.string().min(1).max(MAXIMUM_NAME_LENGTH),
  protocolVersion: z.int().positive(),
  capabilities: z.array(z.string().max(MAXIMUM_NAME_LENGTH)).max(MAXIMUM_CAPABILITIES),
});

export type Platform = z.infer<typeof platformSchema>;
export type DeviceDescription = z.infer<typeof deviceDescriptionSchema>;
