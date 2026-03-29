import { DayNightBar } from "./DayNightBar";
import { ZoneInfo } from "../hooks/useTimezones";
import { TIMEZONE_LIST } from "../data/timezones";

interface ZoneRowProps {
  zoneId: string;
  label: string;
  info: ZoneInfo;
  canRemove: boolean;
  onRemove: () => void;
  dragHandleProps?: Record<string, unknown>;
}

export function ZoneRow({ zoneId, label, info, canRemove, onRemove, dragHandleProps }: ZoneRowProps) {
  const entry = TIMEZONE_LIST.find((t) => t.id === zoneId);
  const flag = entry?.flag ?? "🌐";

  return (
    <div className="group flex items-center gap-2 px-2 py-[6px] rounded-lg mb-[3px] hover:bg-[#2d2d55]" style={{ background: "#252545" }}>
      {/* Drag handle */}
      <span
        className="cursor-grab text-[#555] text-xs select-none opacity-0 group-hover:opacity-100 transition-opacity"
        {...dragHandleProps}
      >
        ⠿
      </span>

      {/* Zone info */}
      <div className="w-[90px] min-w-[90px]">
        <div className="text-[11px] text-[#e0e0e0]">
          {flag} {label}
        </div>
        <div className="text-[9px] text-[#666]">
          {info.abbreviation.startsWith("GMT") ? info.utcOffset : `${info.abbreviation} ${info.utcOffset}`}
        </div>
      </div>

      {/* Time */}
      <div className="w-[50px] min-w-[50px]">
        <div className="text-base font-bold text-[#e0e0e0]">{info.time}</div>
        {info.dayLabel && (
          <div className="text-[9px] text-[#f59e0b]">{info.dayLabel}</div>
        )}
      </div>

      {/* Day/Night bar */}
      <DayNightBar hourPosition={info.hourPosition} />

      {/* Remove button */}
      {canRemove && (
        <button
          onClick={onRemove}
          className="text-[#555] hover:text-[#f87171] text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-none p-0 ml-1"
        >
          ✕
        </button>
      )}
    </div>
  );
}
