import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { TIMEZONE_LIST, TimezoneEntry } from "../data/timezones";

interface AddZoneProps {
  existingZoneIds: string[];
  onAdd: (zone: { id: string; label: string }) => void;
}

function fuzzyMatch(query: string, entry: TimezoneEntry): boolean {
  const q = query.toLowerCase();
  if (entry.label.toLowerCase().includes(q)) return true;
  if (entry.id.toLowerCase().includes(q)) return true;
  if (entry.flag.includes(q)) return true;
  return entry.aliases.some((a) => a.toLowerCase().includes(q));
}

export function AddZone({ existingZoneIds, onAdd }: AddZoneProps) {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searching && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searching]);

  const results = query.trim()
    ? TIMEZONE_LIST.filter((entry) => fuzzyMatch(query, entry))
    : TIMEZONE_LIST;

  const handleSelect = (entry: TimezoneEntry) => {
    if (existingZoneIds.includes(entry.id)) return;
    onAdd({ id: entry.id, label: entry.label });
    setSearching(false);
    setQuery("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      setSearching(false);
      setQuery("");
    }
  };

  if (!searching) {
    return (
      <div className="text-center py-2 px-2">
        <button
          onClick={() => setSearching(true)}
          className="text-[#4ade80] hover:text-[#22c55e] text-xs cursor-pointer bg-transparent border-none transition-colors"
        >
          + Add timezone
        </button>
      </div>
    );
  }

  return (
    <div className="px-2 py-2">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search city, country, or abbreviation..."
        className="w-full bg-[#2a2a5a] border border-[#4ade80] text-[#e0e0e0] rounded-md px-3 py-1.5 text-xs outline-none"
      />
      <div className="max-h-[200px] overflow-y-auto mt-1 rounded-md">
        {results.slice(0, 20).map((entry) => {
          const isDuplicate = existingZoneIds.includes(entry.id);
          return (
            <button
              key={entry.id}
              onClick={() => handleSelect(entry)}
              disabled={isDuplicate}
              className={`w-full text-left px-3 py-1.5 text-xs border-none cursor-pointer block transition-colors ${
                isDuplicate
                  ? "text-[#555] bg-transparent cursor-not-allowed"
                  : "text-[#e0e0e0] bg-transparent hover:bg-[#2d2d55]"
              }`}
            >
              {entry.flag} {entry.label}
              <span className="text-[#666] ml-2">{entry.id}</span>
              {isDuplicate && <span className="text-[#555] ml-2">(added)</span>}
            </button>
          );
        })}
        {results.length === 0 && (
          <div className="text-[#555] text-xs text-center py-2">No matches</div>
        )}
      </div>
    </div>
  );
}
