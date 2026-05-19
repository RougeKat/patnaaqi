import { useEffect, useState } from 'react';
import type { AqiData } from '../types/aqi';

interface UseAqiDataResult {
  data: AqiData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetches the static /data/aqi.json file served from the public directory.
 * In production this file is written periodically by GitHub Actions.
 */
export function useAqiData(): UseAqiDataResult {
  const [data, setData] = useState<AqiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/data/aqi.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load data (HTTP ${res.status})`);
        return res.json() as Promise<AqiData>;
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    // Cleanup: prevent stale state updates if the component unmounts mid-fetch
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
