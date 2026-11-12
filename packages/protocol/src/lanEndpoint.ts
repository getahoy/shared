import { z } from "zod";

export const MAX_LAN_HOSTS = 8;
const MAXIMUM_PORT = 65535;

export const localHostSchema = z.string().regex(/^[A-Za-z0-9-]{1,63}\.local$/);

export const lanEndpointSchema = z.object({
  hosts: z.array(z.ipv4()).max(MAX_LAN_HOSTS),
  port: z.int().min(1).max(MAXIMUM_PORT),
  local: localHostSchema.optional().catch(undefined),
});

export type LanEndpoint = z.infer<typeof lanEndpointSchema>;
