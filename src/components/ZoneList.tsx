import { useState, useRef, useCallback, useEffect } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRectsRef = useRef<DOMRect[]>([]);
  const dragIndexRef = useRef<number | null>(null);
  const overIndexRef = useRef<number | null>(null);

  const captureRowRects = useCallback(() => {
    if (!containerRef.current) return;
    const children = containerRef.current.children;
    rowRectsRef.current = Array.from(children).map((el) => el.getBoundingClientRect());
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, index: number) => {
    // Only left button, ignore if target is interactive
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("button, input, a")) return;

    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragIndexRef.current = index;
    overIndexRef.current = index;
    setDragIndex(index);
    setOverIndex(index);
    captureRowRects();
  }, [captureRowRects]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (dragIndexRef.current === null) return;
    const rects = rowRectsRef.current;
    if (rects.length === 0) return;

    const y = e.clientY;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < rects.length; i++) {
      const mid = rects[i].top + rects[i].height / 2;
      const dist = Math.abs(y - mid);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }

    if (overIndexRef.current !== closest) {
      overIndexRef.current = closest;
      setOverIndex(closest);
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    const from = dragIndexRef.current;
    const to = overIndexRef.current;
    if (from !== null && to !== null && from !== to) {
      onReorder(from, to);
    }
    dragIndexRef.current = null;
    overIndexRef.current = null;
    setDragIndex(null);
    setOverIndex(null);
  }, [onReorder]);

  // Clean up on unmount or if pointer is lost
  useEffect(() => {
    const handleLost = () => {
      dragIndexRef.current = null;
      overIndexRef.current = null;
      setDragIndex(null);
      setOverIndex(null);
    };
    window.addEventListener("pointercancel", handleLost);
    return () => window.removeEventListener("pointercancel", handleLost);
  }, []);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto py-1">
      {zones.map((zone, index) => {
        const info = zoneInfos.get(zone.id);
        if (!info) return null;

        const isDragging = dragIndex === index;
        const isOver = overIndex === index && dragIndex !== null && dragIndex !== index;

        return (
          <div
            key={zone.id}
            onPointerDown={(e) => handlePointerDown(e, index)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              cursor: dragIndex !== null ? "grabbing" : "grab",
              opacity: isDragging ? 0.4 : 1,
              borderTop: isOver ? "1px solid rgba(74,222,128,0.4)" : "1px solid transparent",
              userSelect: "none",
              touchAction: "none",
            }}
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
