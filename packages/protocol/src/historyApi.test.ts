import assert from "node:assert/strict";
import { test } from "node:test";
import {
  historyQuerySchema,
  historyWriteSchema,
  MAX_FOLLOW_UPS,
  MAX_HISTORY_WRITES,
} from "./historyApi.ts";

const KEY = "A".repeat(43);

const done = {
  id: "6f1c8a52-3b8e-4c1f-9a2d-1b2c3d4e5f60",
  rev: 1,
  macKey: KEY,
  macName: "Studio Mac",
  heard: "open pages",
  did: "Opened Pages",
  status: "done",
  app: "Pages",
  via: "rules",
  reason: null,
  timings: { hearingMs: 400, onMacMs: 900 },
  followUps: [],
  startedAt: "2026-11-07T10:00:00.000Z",
  finishedAt: "2026-11-07T10:00:02.000Z",
};

const writeOf = (entries: unknown[]) => ({ phoneKey: KEY, entries });

test("a write batch holds one to twenty entries", () => {
  assert.equal(historyWriteSchema.safeParse(writeOf([done])).success, true);
  const full = Array.from({ length: MAX_HISTORY_WRITES }, () => done);
  assert.equal(historyWriteSchema.safeParse(writeOf(full)).success, true);
  assert.equal(historyWriteSchema.safeParse(writeOf([...full, done])).success, false);
  assert.equal(historyWriteSchema.safeParse(writeOf([])).success, false);
});

test("only failed, blocked and cancelled entries carry a reason", () => {
  for (const status of ["failed", "blocked", "cancelled"]) {
    const ended = { ...done, status, reason: "other" };
    assert.equal(historyWriteSchema.safeParse(writeOf([ended])).success, true);
  }
  for (const status of ["done", "choice"]) {
    const ended = { ...done, status, reason: "other" };
    assert.equal(historyWriteSchema.safeParse(writeOf([ended])).success, false);
  }
});

test("a running entry has no finish time and every other status has one", () => {
  const running = { ...done, status: "running", did: null, finishedAt: null };
  assert.equal(historyWriteSchema.safeParse(writeOf([running])).success, true);
  const finishedRunning = { ...running, finishedAt: done.finishedAt };
  assert.equal(historyWriteSchema.safeParse(writeOf([finishedRunning])).success, false);
  const unfinishedDone = { ...done, finishedAt: null };
  assert.equal(historyWriteSchema.safeParse(writeOf([unfinishedDone])).success, false);
});

test("every write carries a revision that is never negative", () => {
  const { rev: _, ...unrevised } = done;
  assert.equal(historyWriteSchema.safeParse(writeOf([unrevised])).success, false);
  const negative = { ...done, rev: -1 };
  assert.equal(historyWriteSchema.safeParse(writeOf([negative])).success, false);
});

test("an entry keeps at most five follow-ups", () => {
  const followUp = {
    question: "Which one?",
    options: [],
    chosen: null,
    said: null,
    waitedMs: null,
  };
  const many = Array.from({ length: MAX_FOLLOW_UPS + 1 }, () => followUp);
  const asked = { ...done, status: "choice", followUps: many };
  assert.equal(historyWriteSchema.safeParse(writeOf([asked])).success, false);
});

test("a history query shows everything unless a known filter is given", () => {
  const plain = historyQuerySchema.safeParse({});
  assert.equal(plain.success && plain.data.status, "all");
  assert.equal(historyQuerySchema.safeParse({ status: "failed" }).success, true);
  assert.equal(historyQuerySchema.safeParse({ status: "blocked" }).success, false);
});
