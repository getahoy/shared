export { REQUEST_ID_HEADER } from "./api/apiEnvelope";
export { ErrorResponse, SuccessResponse } from "./api/apiResponse";
export {
  type RequestError,
  type RequestResult,
  request,
  requestErrorMessage,
} from "./api/request";
export {
  APPEARANCES,
  type Appearance,
  appearanceCopy,
  appearanceSchema,
  type ResolvedTheme,
  resolvedThemeSchema,
} from "./appearance/appearance";
export { APP_SCHEME } from "./appScheme";
export { authCopy } from "./auth/authCopy";
export { type AuthError, authErrorMessage } from "./auth/authErrorMessage";
export { credentialFields } from "./auth/credentialFields";
export {
  MAXIMUM_PASSWORD_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
  type SignInInput,
  type SignUpInput,
  signInSchema,
  signUpSchema,
} from "./auth/credentialsSchema";
export { socialErrorMessage } from "./auth/socialErrorMessage";
export { type SocialProviderId, socialProviderCatalog } from "./auth/socialProviderCatalog";
export {
  type AuthRequestState,
  type AuthResponse,
  useAuthRequest,
} from "./auth/useAuthRequest";
export { useCredentialsForm } from "./auth/useCredentialsForm";
export { type ErrorCode, errorMessages } from "./errorCodes";
export { historyCopy } from "./history/historyCopy";
export { dayLabel, type HistorySection, sectionsByDay, timeLabel } from "./history/historyDays";
export { HISTORY_SEARCH_DELAY_MS } from "./history/historySearch";
export { reportLines, summaryLine, whyOf } from "./history/historyText";
export { seconds, type TimingSegment, timingSegments, totalMs } from "./history/historyTimings";
export { needsRunConfirm } from "./history/runConfirm";
export { useElapsedOver } from "./hooks/useElapsedOver";
export { spinnerTiming, useSpinnerVisible } from "./hooks/useSpinnerVisible";
export { createLogger, type Logger } from "./logging/logger";
export {
  endedWhen,
  NOTICE_LIFETIME_MS,
  noticeAge,
  noticeShown,
} from "./pairing/endedNotice";
export { type ParsedInput, parseInput } from "./parseInput";
