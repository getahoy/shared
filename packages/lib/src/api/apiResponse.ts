import type { ErrorCode } from "../errorCodes";
import type { ApiError, ApiSuccess } from "./apiEnvelope";

const errorStatus: Record<ErrorCode, number> = {
  invalid_input: 400,
  unauthorized: 401,
  forbidden: 403,
  device_revoked: 403,
  blocked: 403,
  not_found: 404,
  conflict: 409,
  nothing_heard: 422,
  protocol_version_mismatch: 426,
  rate_limited: 429,
  internal: 500,
  broken: 500,
  transient: 503,
};

export function SuccessResponse<T>(data: T, status = 200): Response {
  const body: ApiSuccess<T> = { success: true, data };
  return Response.json(body, { status });
}

export function ErrorResponse(code: ErrorCode, message: string, field?: string): Response {
  const error = field === undefined ? { code, message } : { code, message, field };
  const body: ApiError = { success: false, error };
  return Response.json(body, { status: errorStatus[code] });
}
