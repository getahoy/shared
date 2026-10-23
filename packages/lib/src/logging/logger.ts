import { redact } from "./redact";

type LogLevel = "info" | "warn" | "error";

export type Logger = {
  info: (scope: string, message: string) => void;
  warn: (scope: string, message: string) => void;
  error: (scope: string, message: string, error?: unknown) => void;
};

const consoleWriters: Record<LogLevel, (line: string) => void> = {
  info: console.info,
  warn: console.warn,
  error: console.error,
};

function describeError(error: unknown): string {
  if (error instanceof Error) return error.stack ?? `${error.name}: ${error.message}`;
  return `non-error thrown (${typeof error})`;
}

export function createLogger(requestId: () => string | undefined = () => undefined): Logger {
  const write = (level: LogLevel, scope: string, message: string) => {
    const time = new Date().toISOString();
    const label = level.toUpperCase();
    const id = requestId() ?? "-";
    consoleWriters[level](`${time} [${label}] [${id}] [${scope}] ${redact(message)}`);
  };
  return {
    info: (scope, message) => write("info", scope, message),
    warn: (scope, message) => write("warn", scope, message),
    error: (scope, message, error) =>
      write("error", scope, error === undefined ? message : `${message}\n${describeError(error)}`),
  };
}
