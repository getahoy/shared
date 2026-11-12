import { z } from "zod";
import { bytes32Schema, deviceDescriptionSchema } from "./device.ts";
import { lanEndpointSchema } from "./lanEndpoint.ts";

const MS_PER_SECOND = 1000;

export const pairingCodeSchema = z.string().regex(/^[A-HJ-NP-Z2-9]{8}$/);

export const pairingQrSchema = z.object({
  v: z.literal(1),
  pk: bytes32Schema,
  name: deviceDescriptionSchema.shape.displayName,
  code: pairingCodeSchema,
  psk: bytes32Schema,
  lan: lanEndpointSchema.optional(),
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
