interface TimeSliderProps {
  offset: number;
  onChange: (hours: number) => void;
  onReset: () => void;
  mode: "live" | "fixed";
}

export function TimeSlider({ offset, onChange, onReset, mode }: TimeSliderProps) {
  return (
    <div className="px-4 py-3 border-t border-white/[0.06]">
      <input
        type="range"
        min={-12}
        max={12}
        step={0.25}
        value={offset}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer"
      />
      <div className="flex justify-between items-center mt-0.5">
        <span className="text-[9px] text-white/15">-12h</span>
        {mode === "fixed" ? (
          <button
            onClick={onReset}
            className="text-[9px] text-white/30 hover:text-[#4ade80]/60 cursor-pointer bg-transparent border-none transition-colors"
          >
            reset
          </button>
        ) : (
          <span className="text-[9px] text-white/15">now</span>
        )}
        <span className="text-[9px] text-white/15">+12h</span>
      </div>
    </div>
  );
}
