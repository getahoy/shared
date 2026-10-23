const EMAIL_ADDRESS = /[^\s@<>()"']+@[^\s@<>()"']+\.[^\s@<>()"']+/g;
const BEARER_TOKEN = /bearer\s+\S+/gi;
const LONG_TOKEN = /[A-Za-z0-9_-]{32,}/g;

export function redact(text: string): string {
  return text
    .replace(EMAIL_ADDRESS, "[email]")
    .replace(BEARER_TOKEN, "Bearer [secret]")
    .replace(LONG_TOKEN, "[secret]");
}
