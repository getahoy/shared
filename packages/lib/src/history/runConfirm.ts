// History keeps the words, not the action, so the words decide what deserves a second look.
const RISKY_WORDS = /\b(?:close|quit|exit|e-?mail|mail|draft)\b/i;

export function needsRunConfirm(heard: string): boolean {
  return RISKY_WORDS.test(heard);
}
