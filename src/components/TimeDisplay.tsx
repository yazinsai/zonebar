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
      setTimeout(() => setShaking(false), 300);
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

  const handleBlur = () => {
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="text-center py-3">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={`bg-[#2a2a5a] border border-[#4ade80] text-[#4ade80] text-center text-lg font-bold rounded-md px-3 py-1 w-[100px] outline-none ${shaking ? "animate-shake" : ""}`}
          placeholder="3:00 PM"
        />
        <div className="text-[10px] text-[#666] mt-1">press Enter to apply</div>
      </div>
    );
  }

  return (
    <div className="text-center py-3">
      <button
        onClick={handleClick}
        className="bg-[#4ade80] text-black text-lg font-bold rounded-md px-4 py-1 cursor-pointer border-none hover:bg-[#22c55e] transition-colors"
      >
        {displayTime}
      </button>
      <div className="text-[10px] text-[#666] mt-1">
        {mode === "live" ? "your local time" : "click to change"}
      </div>
    </div>
  );
}
