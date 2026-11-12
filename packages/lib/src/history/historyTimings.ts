import type { HistoryTimings } from "@getahoy/protocol";
import { historyCopy } from "./historyCopy.ts";

const MS_PER_SECOND = 1000;

export type TimingSegment = {
  label: string;
  ms: number;
  tone: "ink" | "driftwood" | "fog";
};

export function seconds(ms: number): string {
  return (ms / MS_PER_SECOND).toFixed(1);
}

export function timingSegments(timings: HistoryTimings): TimingSegment[] {
  const parts: [string, number | undefined, TimingSegment["tone"]][] = [
    [historyCopy.hearing, timings.hearingMs, "ink"],
    [historyCopy.understanding, timings.understandingMs, "driftwood"],
    [historyCopy.onMac, timings.onMacMs, "fog"],
  ];
  return parts.flatMap(([label, ms, tone]) => (ms === undefined ? [] : [{ label, ms, tone }]));
}

export function totalMs(timings: HistoryTimings): number | null {
  const segments = timingSegments(timings);
  if (segments.length === 0) return null;
  return segments.reduce((total, segment) => total + segment.ms, 0);
}
