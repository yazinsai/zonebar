import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface TimeDisplayProps {
  selectedInstant: Date;
  mode: "live" | "fixed";
  onTimeTyped: (timeString: string) => boolean;
}

export function TimeDisplay({ selectedInstant, mode, onTimeTyped }: TimeDisplayProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(selectedInstant);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleClick = () => {
    setInputValue(displayTime);
    setEditing(true);
  };

  const handleSubmit = () => {
    const success = onTimeTyped(inputValue);
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

  if (editing) {
    return (
      <div className="flex items-center justify-center py-3 px-5 border-b border-white/[0.06]">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setEditing(false)}
          className={`bg-transparent border border-[#4ade80]/40 text-[#4ade80] text-center text-sm font-semibold rounded px-2 py-0.5 w-[72px] outline-none focus:border-[#4ade80] ${shaking ? "animate-shake" : ""}`}
          placeholder="3pm"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-3 px-5 border-b border-white/[0.06]">
      <button
        onClick={handleClick}
        className="text-[#4ade80] text-sm font-semibold cursor-pointer bg-transparent border-none hover:text-[#22c55e] transition-colors tracking-wide"
      >
        {displayTime}
      </button>
      {mode === "fixed" && (
        <span className="text-[10px] text-white/20 ml-2">adjusted</span>
      )}
    </div>
  );
}
