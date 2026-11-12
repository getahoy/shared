import {
  apiPaths,
  type PairingClaimRequest,
  type PairingCompleteRequest,
  type PairingUnlinkRequest,
  pairingClaimSchema,
  pairingCompleteSchema,
  pairingLinksSchema,
  pairingUnlinkSchema,
} from "@getahoy/protocol";
import type { CallApi } from "../api/apiClient.ts";

export function pairingCalls(call: CallApi) {
  return {
    claim: (body: PairingClaimRequest) =>
      call({ path: apiPaths.pairingClaim, body, schema: pairingClaimSchema }),
    complete: (body: PairingCompleteRequest) =>
      call({ path: apiPaths.pairingComplete, body, schema: pairingCompleteSchema }),
    unlink: (body: PairingUnlinkRequest) =>
      call({ path: apiPaths.pairingUnlink, body, schema: pairingUnlinkSchema }),
    links: (device: string) =>
      call({ path: apiPaths.pairingLinks, query: { device }, schema: pairingLinksSchema }),
  };
}
