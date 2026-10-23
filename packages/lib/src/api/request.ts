import type { z } from "zod";
import { errorMessages } from "../errorCodes";
import { type ApiError, apiErrorSchema, apiSuccessSchema, REQUEST_ID_HEADER } from "./apiEnvelope";

const DEFAULT_TIMEOUT_MS = 15_000;

export type RequestError =
  | { kind: "api"; status: number; requestId: string | null; detail: ApiError["error"] }
  | { kind: "malformed"; status: number; requestId: string | null }
  | { kind: "network" };

type RequestResult<T> =
  | { code: "success"; data: T }
  | { code: "error"; error: RequestError };

type RequestOptions<T> = {
  url: string;
  schema: z.ZodType<T>;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
};

async function send<T>(options: RequestOptions<T>): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const init: RequestInit = {
    method: options.method ?? "GET",
    headers: { accept: "application/json", "content-type": "application/json", ...options.headers },
    signal: controller.signal,
  };
  if (options.body !== undefined) init.body = JSON.stringify(options.body);
  try {
    return await fetch(options.url, init);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function request<T>(options: RequestOptions<T>): Promise<RequestResult<T>> {
  const response = await send(options);
  if (!response) return { code: "error", error: { kind: "network" } };
  const status = response.status;
  const requestId = response.headers.get(REQUEST_ID_HEADER);
  const body: unknown = await response.json().catch(() => undefined);
  const success = apiSuccessSchema(options.schema).safeParse(body);
  if (success.success) return { code: "success", data: success.data.data };
  const failure = apiErrorSchema.safeParse(body);
  if (failure.success) {
    return { code: "error", error: { kind: "api", status, requestId, detail: failure.data.error } };
  }
  return { code: "error", error: { kind: "malformed", status, requestId } };
}

export function requestErrorMessage(error: RequestError): string {
  switch (error.kind) {
    case "api":
      return error.detail.message;
    case "malformed":
      return errorMessages.internal;
    case "network":
      return errorMessages.transient;
    default: {
      const unhandled: never = error;
      return unhandled;
    }
  }
}
