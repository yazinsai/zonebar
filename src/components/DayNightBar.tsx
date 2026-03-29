interface DayNightBarProps {
  hourPosition: number; // 0-1 float
}

export function DayNightBar({ hourPosition }: DayNightBarProps) {
  // 24h bar with segments:
  // 0-6h (night), 6-8h (dawn), 8-18h (day), 18-20h (dusk), 20-24h (night)
  // As percentages: 25%, 8.33%, 41.67%, 8.33%, 16.67%
  return (
    <div className="relative flex-1 h-[14px] rounded overflow-hidden flex">
      {/* Night: 0-6h = 25% */}
      <div className="h-full" style={{ width: "25%", background: "#12123a" }} />
      {/* Dawn: 6-8h = 8.33% */}
      <div className="h-full" style={{ width: "8.33%", background: "#2a2a5a" }} />
      {/* Day: 8-18h = 41.67% */}
      <div className="h-full" style={{ width: "41.67%", background: "#5a5a8a" }} />
      {/* Dusk: 18-20h = 8.33% */}
      <div className="h-full" style={{ width: "8.33%", background: "#2a2a5a" }} />
      {/* Night: 20-24h = 16.67% */}
      <div className="h-full" style={{ width: "16.67%", background: "#12123a" }} />
      {/* Green marker */}
      <div
        className="absolute top-0 bottom-0 w-[2px]"
        style={{
          left: `${hourPosition * 100}%`,
          background: "#4ade80",
        }}
      />
    </div>
  );
}
