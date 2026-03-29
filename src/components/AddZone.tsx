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
  return entry.aliases.some((a) => a.toLowerCase().includes(q));
}

export function AddZone({ existingZoneIds, onAdd }: AddZoneProps) {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searching && inputRef.current) inputRef.current.focus();
  }, [searching]);

  const results = query.trim()
    ? TIMEZONE_LIST.filter((e) => fuzzyMatch(query, e))
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
      <div className="py-1 px-3">
        <button
          onClick={() => setSearching(true)}
          className="text-white/20 hover:text-white/40 text-[11px] cursor-pointer bg-transparent border-none transition-colors"
        >
          + add
        </button>
      </div>
    );
  }

  return (
    <div className="px-3 py-1.5">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="w-full bg-white/[0.04] border border-white/[0.08] text-white/80 rounded px-2 py-1 text-[11px] outline-none focus:border-white/15 placeholder:text-white/20"
      />
      <div className="max-h-[160px] overflow-y-auto mt-1">
        {results.slice(0, 15).map((entry) => {
          const isDuplicate = existingZoneIds.includes(entry.id);
          return (
            <button
              key={entry.id}
              onClick={() => handleSelect(entry)}
              disabled={isDuplicate}
              className={`w-full text-left px-2 py-1 text-[11px] border-none cursor-pointer block rounded transition-colors ${
                isDuplicate
                  ? "text-white/15 bg-transparent cursor-not-allowed"
                  : "text-white/60 bg-transparent hover:bg-white/[0.04] hover:text-white/80"
              }`}
            >
              {entry.flag} {entry.label}
              {isDuplicate && <span className="ml-1 text-white/10">✓</span>}
            </button>
          );
        })}
        {results.length === 0 && (
          <div className="text-white/15 text-[11px] text-center py-1.5">No matches</div>
        )}
      </div>
    </div>
  );
}
