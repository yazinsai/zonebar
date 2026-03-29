import { DayNightBar } from "./DayNightBar";
import { ZoneInfo } from "../hooks/useTimezones";
import { TIMEZONE_LIST } from "../data/timezones";

interface ZoneRowProps {
  zoneId: string;
  label: string;
  info: ZoneInfo;
  canRemove: boolean;
  onRemove: () => void;
}

export function ZoneRow({ zoneId, label, info, canRemove, onRemove }: ZoneRowProps) {
  const entry = TIMEZONE_LIST.find((t) => t.id === zoneId);
  const flag = entry?.flag ?? "🌐";

  const offsetDisplay = info.abbreviation.startsWith("GMT")
    ? info.utcOffset
    : info.abbreviation;

  return (
    <div className="group flex items-center gap-1.5 px-3 py-[5px] hover:bg-white/[0.03] transition-colors">
      {/* Zone label */}
      <div className="w-[72px] min-w-[72px] flex items-baseline gap-1">
        <span className="text-[11px]">{flag}</span>
        <span className="text-[11px] text-white/70 truncate">{label}</span>
      </div>

      {/* Time */}
      <div className="w-[44px] min-w-[44px] text-right">
        <span className="text-[13px] font-medium tabular-nums text-white/90">{info.time}</span>
      </div>

      {/* Day label or offset */}
      <div className="w-[42px] min-w-[42px] text-center">
        {info.dayLabel ? (
          <span className="text-[9px] text-amber-400/80">{info.dayLabel === "Tomorrow" ? "+1d" : "-1d"}</span>
        ) : (
          <span className="text-[9px] text-white/25">{offsetDisplay}</span>
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
