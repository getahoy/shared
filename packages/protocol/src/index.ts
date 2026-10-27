export {
  COMMAND_STATUSES,
  type CommandFrame,
  type CommandStatus,
  MAX_COMMAND_TEXT_CHARS,
  MAX_RESULT_MESSAGE_CHARS,
} from "./command";
export {
  bytes32Schema,
  type DeviceDescription,
  PLATFORMS,
  type Platform,
  PROTOCOL_VERSION,
  platformSchema,
} from "./device";
export {
  END_REASONS,
  type EndReason,
  endReasonSchema,
  type Frame,
  frameSchema,
  type GoodbyeReason,
  type HandshakeReply,
  type Hello,
  handshakeReplySchema,
  helloSchema,
  unknownMacKeySchema,
  versionProbeSchema,
} from "./handshake";
export {
  DESKTOP_CLIENT_ID,
  type PairingClaim,
  type PairingClaimRequest,
  type PairingComplete,
  type PairingCompleteRequest,
  type PairingLinks,
  type PairingUnlink,
  type PairingUnlinkRequest,
  pairingClaimRequestSchema,
  pairingClaimSchema,
  pairingCompleteRequestSchema,
  pairingCompleteSchema,
  pairingLinksSchema,
  pairingUnlinkRequestSchema,
  pairingUnlinkSchema,
} from "./pairingApi";
export { type PairingQr, pairingQrSchema } from "./pairingQr";
