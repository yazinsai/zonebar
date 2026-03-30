export interface ZoneInfo {
  time: string; // formatted time e.g. "05:30"
  abbreviation: string; // e.g. "PDT" or "GMT-7"
  utcOffset: string; // e.g. "UTC-7"
  relativeOffset: string; // e.g. "+3", "-5", "+5:30" relative to user's local tz
  hourOfDay: number; // 0-23
  minuteOfDay: number; // 0-59
  dayLabel: string | null; // "Yesterday", "Tomorrow", or null
  hourPosition: number; // 0-1 float for bar position
}

function getLocalDateString(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getZoneInfo(instant: Date, zoneId: string): ZoneInfo {
  // Get formatted time
  const timeParts = new Intl.DateTimeFormat("en-US", {
    timeZone: zoneId,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(instant);

  const hour = parseInt(timeParts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(timeParts.find((p) => p.type === "minute")?.value ?? "0", 10);
  const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  // Get abbreviation (e.g. "PDT" or "GMT-7")
  const abbrevFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: zoneId,
    timeZoneName: "short",
  });
  const abbrevParts = abbrevFormatter.formatToParts(instant);
  const abbreviation = abbrevParts.find((p) => p.type === "timeZoneName")?.value ?? "";

  // Get UTC offset
  const longFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: zoneId,
    timeZoneName: "longOffset",
  });
  const longParts = longFormatter.formatToParts(instant);
  const utcOffset = longParts.find((p) => p.type === "timeZoneName")?.value ?? "";

  // Determine day label by comparing calendar dates
  const localDate = getLocalDateString(instant, Intl.DateTimeFormat().resolvedOptions().timeZone);
  const zoneDate = getLocalDateString(instant, zoneId);

  let dayLabel: string | null = null;
  if (localDate !== zoneDate) {
    const local = new Date(localDate);
    const zone = new Date(zoneDate);
    if (zone > local) {
      dayLabel = "Tomorrow";
    } else {
      dayLabel = "Yesterday";
    }
  }

  // Compute relative offset from user's local timezone
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localParts = new Intl.DateTimeFormat("en-US", {
    timeZone: localTz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    day: "numeric",
    month: "numeric",
  }).formatToParts(instant);
  const localH = parseInt(localParts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const localM = parseInt(localParts.find((p) => p.type === "minute")?.value ?? "0", 10);
  const localDay = parseInt(localParts.find((p) => p.type === "day")?.value ?? "0", 10);

  const zoneParts2 = new Intl.DateTimeFormat("en-US", {
    timeZone: zoneId,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    day: "numeric",
    month: "numeric",
  }).formatToParts(instant);
  const zoneH = parseInt(zoneParts2.find((p) => p.type === "hour")?.value ?? "0", 10);
  const zoneM = parseInt(zoneParts2.find((p) => p.type === "minute")?.value ?? "0", 10);
  const zoneDay = parseInt(zoneParts2.find((p) => p.type === "day")?.value ?? "0", 10);

  let diffMinutes = (zoneH * 60 + zoneM) - (localH * 60 + localM) + (zoneDay - localDay) * 1440;
  // Normalize to -720..+720
  if (diffMinutes > 720) diffMinutes -= 1440;
  if (diffMinutes < -720) diffMinutes += 1440;

  let relativeOffset: string;
  if (diffMinutes === 0) {
    relativeOffset = "";
  } else {
    const sign = diffMinutes > 0 ? "+" : "−";
    const absMins = Math.abs(diffMinutes);
    const h = Math.floor(absMins / 60);
    const m = absMins % 60;
    relativeOffset = m === 0 ? `${sign}${h}` : `${sign}${h}:${String(m).padStart(2, "0")}`;
  }

  // Hour position: 0-1 float representing position in 24h day
  const hourPosition = (hour + minute / 60) / 24;

  return {
    time,
    abbreviation,
    utcOffset,
    relativeOffset,
    hourOfDay: hour,
    minuteOfDay: minute,
    dayLabel,
    hourPosition,
  };
}

export function formatTimeForZone(instant: Date, zoneId: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zoneId,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(instant);
}
