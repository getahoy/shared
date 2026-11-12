import { z } from "zod";
import { bytes32Schema, deviceDescriptionSchema } from "./device.ts";

const MAXIMUM_LAN_HOSTS = 8;
const MS_PER_SECOND = 1000;

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

export function readPairingQr(text: string): PairingQr | null {
  try {
    const parsed = pairingQrSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function pairingQrExpired(qr: PairingQr, nowMs: number): boolean {
  return qr.exp * MS_PER_SECOND <= nowMs;
}
