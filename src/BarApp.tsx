import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { usePreferences } from "./hooks/usePreferences";

function formatTime(date: Date, zoneId: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zoneId,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function BarApp() {
  const { zones } = usePreferences();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const handleClick = () => {
    invoke("toggle_popup").catch(console.error);
  };

  // Show the first zone as the always-visible indicator
  const primary = zones[0];

  return (
    <div
      onClick={handleClick}
      className="bar-root flex items-center gap-1.5 h-full px-2.5 cursor-pointer select-none"
    >
      <span className="text-white/40 text-[9px] uppercase tracking-wide">
        {primary?.label.split(" ")[0] ?? "TZ"}
      </span>
      <span className="text-white/90 text-[12px] tabular-nums font-semibold">
        {primary ? formatTime(now, primary.id) : "--:--"}
      </span>
    </div>
  );
}
