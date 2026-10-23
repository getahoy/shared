import { z } from "zod";
import { bytes32Schema, deviceDescriptionSchema } from "./device";
import { pairingCodeSchema } from "./pairingQr";

export const DESKTOP_CLIENT_ID = "ahoy-desktop";

export const pairingClaimRequestSchema = z.object({
  userCode: pairingCodeSchema,
  desktopPublicKey: bytes32Schema,
  proof: bytes32Schema,
  device: deviceDescriptionSchema,
});

export const pairingClaimSchema = z.object({ approved: z.literal(true) });

export const pairingCompleteRequestSchema = z.object({
  userCode: pairingCodeSchema,
  device: deviceDescriptionSchema,
});

export const pairingCompleteSchema = z.object({
  desktopId: z.uuid(),
  accountEmail: z.email(),
  phone: deviceDescriptionSchema,
  proof: bytes32Schema,
});

export type PairingClaimRequest = z.infer<typeof pairingClaimRequestSchema>;
export type PairingClaim = z.infer<typeof pairingClaimSchema>;
export type PairingCompleteRequest = z.infer<typeof pairingCompleteRequestSchema>;
export type PairingComplete = z.infer<typeof pairingCompleteSchema>;
