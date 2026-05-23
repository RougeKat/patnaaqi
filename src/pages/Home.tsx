import { lazy, Suspense, useEffect, useState } from 'react';
import { useAqiData } from '../hooks/useAqiData';
import { formatRelativeTime, formatNextUpdate } from '../lib/time';
import HeroAQICard from '../components/HeroAQICard';
import HeroSkeleton from '../components/HeroSkeleton';
import type { PollutantData } from '../components/PollutantCard';
import { loadSnapshot, saveSnapshot, computeDeltas } from '../lib/snapshot';
import type { AqiDeltas } from '../lib/snapshot';

// Lazy-load ForecastChart — Recharts is heavy (~180KB) and always below the fold.
// This defers its download until after the hero card is interactive.
const ForecastChart = lazy(() => import('../components/ForecastChart'));

export default function Home() {
  const { data, loading, error } = useAqiData();
  const [deltas, setDeltas] = useState<AqiDeltas | null>(null);

  useEffect(() => {
    if (!data) return;

    const prev = loadSnapshot();

    // Build a flat pollutant map for the snapshot
    const currentPollutants = Object.fromEntries(
      data.current.pollutants.map((p) => [p.id, p.value]),
    );

    // Only treat it as a new update when generated_at has advanced
    if (!prev || prev.generated_at !== data.meta.generated_at) {
      // Compute deltas against the old snapshot (null on first visit → no arrows)
      setDeltas(computeDeltas({ aqi: data.current.aqi, pollutants: currentPollutants }, prev));
      // Save the current reading as the new snapshot
      saveSnapshot({
        generated_at: data.meta.generated_at,
        aqi: data.current.aqi,
        pollutants: currentPollutants,
      });
    } else {
      // Same generated_at = page refresh → keep showing deltas from last real update
      setDeltas(computeDeltas({ aqi: data.current.aqi, pollutants: currentPollutants }, prev));
    }
  }, [data]);

  // --- Loading state ---
  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-8">
        <HeroSkeleton />
      </div>
    );
  }

  // --- Error state ---
  if (error || !data) {
    return (
      <div className="p-4 md:p-8">
        <div className="rounded-[24px] border border-[var(--color-aqi-poor)] bg-[var(--color-aqi-poor)]/10 p-8 text-center">
          <p className="text-[var(--color-aqi-poor)] font-semibold text-lg">
            Unable to load air quality data
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
            Please try refreshing the page. If the problem persists, check back shortly.
          </p>
        </div>
      </div>
    );
  }

  // --- Map JSON pollutants to PollutantCard props (with deltas) ---
  const pollutants: PollutantData[] = data.current.pollutants.map((p) => ({
    id: p.id,
    name: p.display_name,
    value: p.value,
    unit: p.unit,
    category: p.category,
    delta: deltas?.pollutants[p.id] ?? null,
  }));

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Hero Section */}
      <HeroAQICard
        aqi={data.current.aqi}
        aqiDelta={deltas?.aqi ?? null}
        updatedAt={formatRelativeTime(data.meta.generated_at)}
        nextUpdateIn={formatNextUpdate(data.meta.next_update_at)}
        pollutants={pollutants}
      />

      {/* Forecast Chart — lazy loaded after hero is visible */}
      <Suspense fallback={
        <div className="rounded-[24px] h-[420px] animate-pulse bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]" />
      }>
        <ForecastChart hourlyData={data.forecast.hourly} />
      </Suspense>
    </div>
  );
}
