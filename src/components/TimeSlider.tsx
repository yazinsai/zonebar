interface TimeSliderProps {
  offset: number; // -12 to 12
  onChange: (hours: number) => void;
  onReset: () => void;
  mode: "live" | "fixed";
}

export function TimeSlider({ offset, onChange, onReset, mode }: TimeSliderProps) {
  return (
    <div className="px-4 pt-2 pb-3">
      <input
        type="range"
        min={-12}
        max={12}
        step={0.25}
        value={offset}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-[6px] rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #333 0%, #333 ${((offset + 12) / 24) * 100}%, #333 100%)`,
          accentColor: "#4ade80",
        }}
      />
      <div className="flex justify-between text-[9px] text-[#555] mt-1">
        <span>-12h</span>
        <span>now</span>
        <span>+12h</span>
      </div>
      {mode === "fixed" && (
        <div className="text-center mt-1">
          <button
            onClick={onReset}
            className="text-[#666] hover:text-[#4ade80] text-[10px] cursor-pointer bg-transparent border-none transition-colors"
          >
            Reset to now
          </button>
        </div>
      )}
    </div>
  );
}
