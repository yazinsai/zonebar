import { useState, useRef } from "react";
import { ZoneRow } from "./ZoneRow";
import { ZoneInfo } from "../hooks/useTimezones";
import { ZonePreference } from "../hooks/usePreferences";

interface ZoneListProps {
  zones: ZonePreference[];
  zoneInfos: Map<string, ZoneInfo>;
  onRemove: (zoneId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function ZoneList({ zones, zoneInfos, onRemove, onReorder }: ZoneListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    dragNodeRef.current = e.currentTarget as HTMLDivElement;
    e.dataTransfer.effectAllowed = "move";
    // Make the drag image slightly transparent
    setTimeout(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = "0.4";
      }
    }, 0);
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = "1";
    }
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      onReorder(dragIndex, overIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
    dragNodeRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  };

  return (
    <div className="flex-1 overflow-y-auto px-2 py-1">
      {zones.map((zone, index) => {
        const info = zoneInfos.get(zone.id);
        if (!info) return null;

        return (
          <div
            key={zone.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            className={`transition-transform ${
              overIndex === index && dragIndex !== null && dragIndex !== index
                ? dragIndex < index
                  ? "translate-y-1"
                  : "-translate-y-1"
                : ""
            }`}
          >
            <ZoneRow
              zoneId={zone.id}
              label={zone.label}
              info={info}
              canRemove={zones.length > 1}
              onRemove={() => onRemove(zone.id)}
            />
          </div>
        );
      })}
    </div>
  );
}
