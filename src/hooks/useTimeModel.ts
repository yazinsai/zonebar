import { useState, useEffect, useCallback, useRef } from "react";
import { listen } from "@tauri-apps/api/event";

type TimeMode = "live" | "fixed";

interface TimeModel {
  mode: TimeMode;
  selectedInstant: Date;
  sliderOffset: number; // hours from now, -12 to +12
  setSliderOffset: (hours: number) => void;
  setTypedTime: (timeString: string) => boolean; // returns false if invalid
  setTypedTimeForZone: (timeString: string, zoneId: string) => boolean;
  resetToNow: () => void;
}

// Parse time strings like "3pm", "3:30pm", "15:00", "3:30 PM"
function parseTimeString(input: string): { hours: number; minutes: number } | null {
  const trimmed = input.trim().toLowerCase();

  // Match "15:00" or "3:30"
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const h = parseInt(match24[1], 10);
    const m = parseInt(match24[2], 10);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      return { hours: h, minutes: m };
    }
    return null;
  }

  // Match "3pm", "3:30pm", "3 pm", "3:30 PM", "12am"
  const match12 = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (match12) {
    let h = parseInt(match12[1], 10);
    const m = match12[2] ? parseInt(match12[2], 10) : 0;
    const period = match12[3];

    if (h < 1 || h > 12 || m < 0 || m > 59) return null;

    if (period === "am" && h === 12) h = 0;
    else if (period === "pm" && h !== 12) h += 12;

    return { hours: h, minutes: m };
  }

  return null;
}

export function useTimeModel(): TimeModel {
  const [mode, setMode] = useState<TimeMode>("live");
  const [selectedInstant, setSelectedInstant] = useState<Date>(new Date());
  const [sliderOffset, setSliderOffsetState] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live mode: update every 60s
  useEffect(() => {
    if (mode === "live") {
      setSelectedInstant(new Date());
      setSliderOffsetState(0);
      intervalRef.current = setInterval(() => {
        setSelectedInstant(new Date());
      }, 60000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [mode]);

  // Listen for popover-opened event to reset to live mode
  useEffect(() => {
    const unlisten = listen("popover-opened", () => {
      setMode("live");
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  const setSliderOffset = useCallback((hours: number) => {
    const clamped = Math.max(-12, Math.min(12, hours));
    setSliderOffsetState(clamped);
    setMode("fixed");
    const now = new Date();
    setSelectedInstant(new Date(now.getTime() + clamped * 60 * 60 * 1000));
  }, []);

  const setTypedTime = useCallback((timeString: string): boolean => {
    const parsed = parseTimeString(timeString);
    if (!parsed) return false;

    const now = new Date();
    const target = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parsed.hours,
      parsed.minutes,
      0,
      0
    );

    setSelectedInstant(target);
    setMode("fixed");

    // Compute slider offset (clamped to ±12h for display)
    const offsetMs = target.getTime() - now.getTime();
    const offsetHours = offsetMs / (60 * 60 * 1000);
    setSliderOffsetState(Math.max(-12, Math.min(12, offsetHours)));

    return true;
  }, []);

  const setTypedTimeForZone = useCallback((timeString: string, zoneId: string): boolean => {
    const parsed = parseTimeString(timeString);
    if (!parsed) return false;

    const now = new Date();

    // Get today's date in the target zone
    const zoneDateParts = new Intl.DateTimeFormat("en-US", {
      timeZone: zoneId,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const zoneYear = parseInt(zoneDateParts.find((p) => p.type === "year")?.value ?? "0", 10);
    const zoneMonth = parseInt(zoneDateParts.find((p) => p.type === "month")?.value ?? "0", 10) - 1;
    const zoneDay = parseInt(zoneDateParts.find((p) => p.type === "day")?.value ?? "0", 10);

    // Get the zone's current UTC offset by comparing UTC and zone wall clocks
    const nowUtcH = now.getUTCHours();
    const nowUtcM = now.getUTCMinutes();
    const nowZoneParts = new Intl.DateTimeFormat("en-US", {
      timeZone: zoneId,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(now);
    const nowZoneH = parseInt(nowZoneParts.find((p) => p.type === "hour")?.value ?? "0", 10);
    const nowZoneM = parseInt(nowZoneParts.find((p) => p.type === "minute")?.value ?? "0", 10);

    let offsetMinutes = (nowZoneH * 60 + nowZoneM) - (nowUtcH * 60 + nowUtcM);
    if (offsetMinutes > 720) offsetMinutes -= 1440;
    if (offsetMinutes < -720) offsetMinutes += 1440;

    // Target UTC = desired wall clock time in zone - zone's UTC offset
    const targetUtcMs = Date.UTC(zoneYear, zoneMonth, zoneDay, parsed.hours, parsed.minutes, 0) - offsetMinutes * 60000;
    const target = new Date(targetUtcMs);

    setSelectedInstant(target);
    setMode("fixed");

    const diffMs = target.getTime() - now.getTime();
    const diffHours = diffMs / (60 * 60 * 1000);
    setSliderOffsetState(Math.max(-12, Math.min(12, diffHours)));

    return true;
  }, []);

  const resetToNow = useCallback(() => {
    setMode("live");
  }, []);

  return {
    mode,
    selectedInstant,
    sliderOffset,
    setSliderOffset,
    setTypedTime,
    setTypedTimeForZone,
    resetToNow,
  };
}
