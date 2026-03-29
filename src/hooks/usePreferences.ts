import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { DEFAULT_ZONES } from "../data/timezones";

export interface ZonePreference {
  id: string;
  label: string;
}

interface Preferences {
  zones: ZonePreference[];
}

export function usePreferences() {
  const [zones, setZonesState] = useState<ZonePreference[]>(DEFAULT_ZONES);
  const [loaded, setLoaded] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    invoke<string>("read_preferences")
      .then((data) => {
        const prefs: Preferences = JSON.parse(data);
        if (prefs.zones && prefs.zones.length > 0) {
          setZonesState(prefs.zones);
        }
      })
      .catch(() => {
        // Corrupt or missing file — use defaults
      })
      .finally(() => setLoaded(true));
  }, []);

  const saveZones = useCallback((newZones: ZonePreference[]) => {
    const data = JSON.stringify({ zones: newZones });
    invoke("write_preferences", { data }).catch(console.error);
  }, []);

  const setZones = useCallback(
    (newZones: ZonePreference[]) => {
      setZonesState(newZones);
      saveZones(newZones);
    },
    [saveZones]
  );

  const addZone = useCallback(
    (zone: ZonePreference) => {
      setZonesState((prev) => {
        if (prev.some((z) => z.id === zone.id)) return prev;
        const updated = [...prev, zone];
        saveZones(updated);
        return updated;
      });
    },
    [saveZones]
  );

  const removeZone = useCallback(
    (zoneId: string) => {
      setZonesState((prev) => {
        if (prev.length <= 1) return prev;
        const updated = prev.filter((z) => z.id !== zoneId);
        saveZones(updated);
        return updated;
      });
    },
    [saveZones]
  );

  const reorderZones = useCallback(
    (fromIndex: number, toIndex: number) => {
      setZonesState((prev) => {
        const updated = [...prev];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        saveZones(updated);
        return updated;
      });
    },
    [saveZones]
  );

  return { zones, loaded, setZones, addZone, removeZone, reorderZones };
}
