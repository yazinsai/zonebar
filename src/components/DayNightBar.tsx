interface DayNightBarProps {
  hourPosition: number;
}

export function DayNightBar({ hourPosition }: DayNightBarProps) {
  return (
    <div className="relative flex-1 h-[8px] rounded-sm overflow-hidden flex">
      <div className="h-full" style={{ width: "25%", background: "rgba(255,255,255,0.03)" }} />
      <div className="h-full" style={{ width: "8.33%", background: "rgba(255,255,255,0.06)" }} />
      <div className="h-full" style={{ width: "41.67%", background: "rgba(255,255,255,0.10)" }} />
      <div className="h-full" style={{ width: "8.33%", background: "rgba(255,255,255,0.06)" }} />
      <div className="h-full" style={{ width: "16.67%", background: "rgba(255,255,255,0.03)" }} />
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{ left: `${hourPosition * 100}%`, background: "#4ade80", opacity: 0.7 }}
      />
    </div>
  );
}
