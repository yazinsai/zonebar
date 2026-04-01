import { useState, useRef } from "react";
import { ZoneRow } from "./ZoneRow";
import { ZoneInfo } from "../hooks/useTimezones";
import { ZonePreference } from "../hooks/usePreferences";

interface ZoneListProps {
  zones: ZonePreference[];
  zoneInfos: Map<string, ZoneInfo>;
  onRemove: (zoneId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onTimeTyped: (timeString: string, zoneId: string) => boolean;
}

export function ZoneList({ zones, zoneInfos, onRemove, onReorder, onTimeTyped }: ZoneListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  const overIndexRef = useRef<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragIndexRef.current = index;
    setDragIndex(index);
    dragNodeRef.current = e.currentTarget as HTMLDivElement;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      if (dragNodeRef.current) dragNodeRef.current.style.opacity = "0.3";
    }, 0);
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) dragNodeRef.current.style.opacity = "1";
    if (dragIndexRef.current !== null && overIndexRef.current !== null && dragIndexRef.current !== overIndexRef.current) {
      onReorder(dragIndexRef.current, overIndexRef.current);
    }
    dragIndexRef.current = null;
    overIndexRef.current = null;
    setDragIndex(null);
    setOverIndex(null);
    dragNodeRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    overIndexRef.current = index;
    setOverIndex(index);
  };

  return (
    <div className="flex-1 overflow-y-auto py-1">
      {zones.map((zone, index) => {
        const info = zoneInfos.get(zone.id);
        if (!info) return null;

        const isOver = overIndex === index && dragIndex !== null && dragIndex !== index;

        return (
          <div
            key={zone.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            style={{ cursor: "grab", borderTop: isOver ? "1px solid rgba(74,222,128,0.4)" : "1px solid transparent" }}
          >
            <ZoneRow
              zoneId={zone.id}
              label={zone.label}
              info={info}
              canRemove={zones.length > 1}
              onRemove={() => onRemove(zone.id)}
              onTimeTyped={onTimeTyped}
            />
          </div>
        );
      })}
    </div>
  );
}
