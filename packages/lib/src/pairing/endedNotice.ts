type NoticeAge =
  | { kind: "justNow" }
  | { kind: "minutes"; count: number }
  | { kind: "hours"; count: number };

const MS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;
const HOURS_SHOWN = 24;
const NOTICE_LIFETIME_MS = HOURS_SHOWN * MINUTES_PER_HOUR * MS_PER_MINUTE;

const endedWhenCopy = {
  justNow: "Just now",
  minutes: (count: number) => (count === 1 ? "1 minute ago" : `${count} minutes ago`),
  hours: (count: number) => (count === 1 ? "1 hour ago" : `${count} hours ago`),
  away: (when: string, awayNote: string) => `${when} · ${awayNote}`,
};

export function noticeShown(notice: { at: number }, now: number): boolean {
  return now - notice.at < NOTICE_LIFETIME_MS;
}

function noticeAge(at: number, now: number): NoticeAge {
  const minutes = Math.floor((now - at) / MS_PER_MINUTE);
  if (minutes < 1) return { kind: "justNow" };
  if (minutes < MINUTES_PER_HOUR) return { kind: "minutes", count: minutes };
  return { kind: "hours", count: Math.floor(minutes / MINUTES_PER_HOUR) };
}

function ageText(age: NoticeAge): string {
  switch (age.kind) {
    case "justNow":
      return endedWhenCopy.justNow;
    case "minutes":
      return endedWhenCopy.minutes(age.count);
    case "hours":
      return endedWhenCopy.hours(age.count);
    default: {
      const unhandled: never = age;
      return unhandled;
    }
  }
}

export function endedWhen(at: number, now: number, awayNote: string | null): string {
  const when = ageText(noticeAge(at, now));
  return awayNote ? endedWhenCopy.away(when, awayNote) : when;
}
