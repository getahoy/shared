import type { z } from "zod";
import { type RequestResult, request } from "./request.ts";

type Headers = Record<string, string>;

type ApiClientOptions = {
  baseUrl: string;
  headers: () => Headers | Promise<Headers>;
  fetch?: typeof fetch;
};

type ApiCall<T> = {
  path: string;
  schema: z.ZodType<T>;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  form?: FormData;
  query?: Readonly<Record<string, string>>;
  timeoutMs?: number;
};

export type CallApi = <T>(call: ApiCall<T>) => Promise<RequestResult<T>>;

export function createApiClient(options: ApiClientOptions) {
  const url = (path: string, query: Readonly<Record<string, string>> = {}) => {
    const built = new URL(path, options.baseUrl);
    for (const [name, text] of Object.entries(query)) built.searchParams.set(name, text);
    return built.toString();
  };
  const call: CallApi = async (call) => {
    const sends = call.body !== undefined || call.form !== undefined;
    return request({
      url: url(call.path, call.query),
      schema: call.schema,
      method: call.method ?? (sends ? "POST" : "GET"),
      headers: await options.headers(),
      ...(call.body === undefined ? {} : { body: call.body }),
      ...(call.form === undefined ? {} : { form: call.form }),
      ...(call.timeoutMs === undefined ? {} : { timeoutMs: call.timeoutMs }),
      ...(options.fetch === undefined ? {} : { fetch: options.fetch }),
    });
  };
  return { call, url, headers: options.headers };
}

export type ApiClient = ReturnType<typeof createApiClient>;
