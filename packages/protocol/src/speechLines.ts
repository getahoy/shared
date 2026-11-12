export const SPEECH_SPEED = 0.9;
export const SENTENCE_PAUSE_SECONDS = 0.3;

// The phone keys cached audio by this, so changing either number never replays old audio.
export function speechPaceKey(): string {
  return `speed${SPEECH_SPEED}-pause${SENTENCE_PAUSE_SECONDS}`;
}

export const VOICE_PREVIEW_LINE =
  "Hey there! Your Mac’s all set. So, what are we working on today?";

export const PROMPT_LINES = {
  whichOne: "Which one? Say the number.",
  confirm: "Tap the button on your phone to go ahead.",
} as const;

export type PromptLine = keyof typeof PROMPT_LINES;
