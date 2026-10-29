import assert from "node:assert/strict";
import { test } from "node:test";
import { z } from "zod";
import { commandFrameSchemas, MAX_SPEECH_CHARS } from "./command.ts";
import { MAX_SPEAK_TEXT_CHARS, speakRequestSchema } from "./speakApi.ts";

const frames = z.discriminatedUnion("type", [...commandFrameSchemas]);

const ROOT = "6f1c8a52-3b8e-4c1f-9a2d-1b2c3d4e5f60";
const FOLLOW_UP = "0a1b2c3d-4e5f-4a6b-8c7d-8e9f0a1b2c3d";

const result = {
  type: "command.result",
  commandId: FOLLOW_UP,
  threadId: ROOT,
  status: "done",
  message: "Clicked Save",
};

test("a command always says where its reply is spoken", () => {
  const command = { type: "command", commandId: ROOT, text: "click save" };
  for (const speakOn of ["phone", "mac", "both", "off"]) {
    assert.equal(frames.safeParse({ ...command, speakOn }).success, true);
  }
  assert.equal(frames.safeParse(command).success, false);
  const elsewhere = { ...command, speakOn: "watch" };
  assert.equal(frames.safeParse(elsewhere).success, false);
});

test("a result carries its thread and optional short speech", () => {
  assert.equal(frames.safeParse(result).success, true);
  const spoken = { ...result, speech: "Done. Clicked Save." };
  assert.equal(frames.safeParse(spoken).success, true);
  const { threadId: _, ...threadless } = result;
  assert.equal(frames.safeParse(threadless).success, false);
});

test("speech is never empty and never longer than 140 characters", () => {
  const long = { ...result, speech: "a".repeat(MAX_SPEECH_CHARS + 1) };
  assert.equal(frames.safeParse(long).success, false);
  assert.equal(frames.safeParse({ ...result, speech: "" }).success, false);
});

test("speech.stop and choice.extend frames", () => {
  assert.equal(frames.safeParse({ type: "speech.stop" }).success, true);
  const extend = { type: "choice.extend", choiceId: ROOT };
  assert.equal(frames.safeParse(extend).success, true);
  const noId = { type: "choice.extend" };
  assert.equal(frames.safeParse(noId).success, false);
});

test("speak requests need short, non-empty text and a known voice", () => {
  const ok = { text: "Done. Opened Calculator.", voice: "india" };
  assert.equal(speakRequestSchema.safeParse(ok).success, true);
  const blank = { text: "   ", voice: "default" };
  assert.equal(speakRequestSchema.safeParse(blank).success, false);
  const long = { text: "a".repeat(MAX_SPEAK_TEXT_CHARS + 1), voice: "default" };
  assert.equal(speakRequestSchema.safeParse(long).success, false);
  const other = { text: "Hi", voice: "robot" };
  assert.equal(speakRequestSchema.safeParse(other).success, false);
});
