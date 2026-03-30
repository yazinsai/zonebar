import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { DayNightBar } from "./DayNightBar";
import { ZoneInfo } from "../hooks/useTimezones";
import { TIMEZONE_LIST } from "../data/timezones";

interface ZoneRowProps {
  zoneId: string;
  label: string;
  info: ZoneInfo;
  canRemove: boolean;
  onRemove: () => void;
  onTimeTyped: (timeString: string, zoneId: string) => boolean;
}

export function ZoneRow({ zoneId, label, info, canRemove, onRemove, onTimeTyped }: ZoneRowProps) {
  const entry = TIMEZONE_LIST.find((t) => t.id === zoneId);
  const flag = entry?.flag ?? "🌐";

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleTimeClick = () => {
    setInputValue(info.time);
    setEditing(true);
  };

  const handleSubmit = () => {
    const success = onTimeTyped(inputValue, zoneId);
    if (success) {
      setEditing(false);
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 250);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      e.stopPropagation();
      setEditing(false);
    }
  };

  return (
    <div className="group flex items-center gap-1.5 px-5 py-[7px] hover:bg-white/[0.03] transition-colors">
      {/* Zone label */}
      <div className="w-[72px] min-w-[72px] flex items-baseline gap-1">
        <span className="text-[11px]">{flag}</span>
        <span className="text-[11px] text-white/70 truncate">{label}</span>
      </div>

      {/* Time (clickable or editable) */}
      <div className="w-[52px] min-w-[52px] text-right">
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setEditing(false)}
            className={`bg-transparent border border-[#4ade80]/40 text-[#4ade80] text-right text-[13px] font-medium rounded px-1 py-0 w-[48px] outline-none tabular-nums ${shaking ? "animate-shake" : ""}`}
          />
        ) : (
          <button
            onClick={handleTimeClick}
            className="text-[13px] font-medium tabular-nums text-white/90 hover:text-[#4ade80] bg-transparent border-none cursor-pointer transition-colors p-0"
          >
            {info.time}
          </button>
        )}
      </div>

      {/* Relative offset or day label */}
      <div className="w-[36px] min-w-[36px] text-center">
        {info.dayLabel ? (
          <span className="text-[9px] text-amber-400/80">{info.dayLabel === "Tomorrow" ? "+1d" : "-1d"}</span>
        ) : (
          <span className="text-[9px] text-white/25 tabular-nums">{info.relativeOffset}</span>
        )}
      </div>

      {/* Day/Night bar */}
      <DayNightBar hourPosition={info.hourPosition} />

      {/* Remove button */}
      {canRemove && (
        <button
          onClick={onRemove}
          className="text-white/0 group-hover:text-white/20 hover:!text-red-400/60 text-[10px] cursor-pointer bg-transparent border-none p-0 ml-0.5 transition-colors leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}
