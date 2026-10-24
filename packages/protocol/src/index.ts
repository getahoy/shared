export {
  bytes32Schema,
  type DeviceDescription,
  PLATFORMS,
  type Platform,
  PROTOCOL_VERSION,
  platformSchema,
} from "./device";
export {
  type Frame,
  frameSchema,
  type HandshakeReply,
  type Hello,
  handshakeReplySchema,
  helloSchema,
  versionProbeSchema,
} from "./handshake";
export {
  DESKTOP_CLIENT_ID,
  type PairingClaim,
  type PairingClaimRequest,
  type PairingComplete,
  type PairingCompleteRequest,
  type PairingUnlink,
  type PairingUnlinkRequest,
  pairingClaimRequestSchema,
  pairingClaimSchema,
  pairingCompleteRequestSchema,
  pairingCompleteSchema,
  pairingUnlinkRequestSchema,
  pairingUnlinkSchema,
} from "./pairingApi";
export { type PairingQr, pairingQrSchema } from "./pairingQr";
