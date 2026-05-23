/**
 * localStorage snapshot helper for AQI delta indicators.
 *
 * Stores the previous hourly reading so the UI can show
 * ↑ / ↓ / — change indicators next to AQI and pollutant values.
 */

const STORAGE_KEY = 'patna_aqi_snapshot';

export interface AqiSnapshot {
  generated_at: string;
  aqi: number;
  /** Keyed by pollutant id (pm25, pm10, no2, so2, co, o3) */
  pollutants: Record<string, number>;
}

export interface AqiDeltas {
  aqi: number;
  pollutants: Record<string, number>;
}

/** Read the stored snapshot, returns null if unavailable. */
export function loadSnapshot(): AqiSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AqiSnapshot) : null;
  } catch {
    return null;
  }
}

/** Persist a snapshot (fails silently in private browsing). */
export function saveSnapshot(snapshot: AqiSnapshot): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // localStorage unavailable — graceful no-op
  }
}

/**
 * Compute numeric deltas between current values and the previous snapshot.
 * Returns null if no previous snapshot exists (first visit).
 */
export function computeDeltas(
  current: { aqi: number; pollutants: Record<string, number> },
  prev: AqiSnapshot | null,
): AqiDeltas | null {
  if (!prev) return null;
  return {
    aqi: current.aqi - prev.aqi,
    pollutants: Object.fromEntries(
      Object.entries(current.pollutants).map(([id, val]) => [
        id,
        +(val - (prev.pollutants[id] ?? val)).toFixed(2),
      ]),
    ),
  };
}
