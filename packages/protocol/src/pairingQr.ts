import { z } from "zod";
import { bytes32Schema, deviceDescriptionSchema } from "./device";

const MAXIMUM_LAN_HOSTS = 8;

export const pairingCodeSchema = z.string().regex(/^[A-HJ-NP-Z2-9]{8}$/);

export const pairingQrSchema = z.object({
  v: z.literal(1),
  pk: bytes32Schema,
  name: deviceDescriptionSchema.shape.displayName,
  code: pairingCodeSchema,
  psk: bytes32Schema,
  lan: z
    .object({
      hosts: z.array(z.ipv4()).max(MAXIMUM_LAN_HOSTS),
      port: z.int().min(1).max(65535),
    })
    .optional(),
  exp: z.int().positive(),
});

export type PairingQr = z.infer<typeof pairingQrSchema>;
