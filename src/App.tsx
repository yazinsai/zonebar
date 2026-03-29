import { useEffect, useMemo } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useTimeModel } from "./hooks/useTimeModel";
import { usePreferences } from "./hooks/usePreferences";
import { getZoneInfo, ZoneInfo } from "./hooks/useTimezones";
import { TimeDisplay } from "./components/TimeDisplay";
import { ZoneList } from "./components/ZoneList";
import { AddZone } from "./components/AddZone";
import { TimeSlider } from "./components/TimeSlider";

function App() {
  const timeModel = useTimeModel();
  const { zones, loaded, addZone, removeZone, reorderZones } = usePreferences();

  // Compute zone infos for all zones
  const zoneInfos = useMemo(() => {
    const map = new Map<string, ZoneInfo>();
    for (const zone of zones) {
      map.set(zone.id, getZoneInfo(timeModel.selectedInstant, zone.id));
    }
    return map;
  }, [zones, timeModel.selectedInstant]);

  // Global Esc handler: close popover if no input is focused
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const active = document.activeElement;
        if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
          return; // Let the input's own handler deal with it
        }
        getCurrentWindow().hide();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#888] text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Fixed top: Time display */}
      <TimeDisplay
        selectedInstant={timeModel.selectedInstant}
        mode={timeModel.mode}
        onTimeTyped={timeModel.setTypedTime}
      />

      {/* Scrollable middle: Zone list + Add button */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <ZoneList
          zones={zones}
          zoneInfos={zoneInfos}
          onRemove={removeZone}
          onReorder={reorderZones}
        />
        <AddZone
          existingZoneIds={zones.map((z) => z.id)}
          onAdd={addZone}
        />
      </div>

      {/* Fixed bottom: Slider */}
      <TimeSlider
        offset={timeModel.sliderOffset}
        onChange={timeModel.setSliderOffset}
        onReset={timeModel.resetToNow}
        mode={timeModel.mode}
      />
    </div>
  );
}

export default App;
