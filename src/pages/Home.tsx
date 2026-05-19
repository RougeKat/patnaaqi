import { useAqiData } from '../hooks/useAqiData';
import { formatRelativeTime, formatNextUpdate } from '../lib/time';
import HeroAQICard from '../components/HeroAQICard';
import HeroSkeleton from '../components/HeroSkeleton';
import type { PollutantData } from '../components/PollutantCard';

export default function Home() {
  const { data, loading, error } = useAqiData();

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

  // --- Map JSON pollutants to PollutantCard props ---
  const pollutants: PollutantData[] = data.current.pollutants.map((p) => ({
    id: p.id,
    name: p.display_name,
    value: p.value,
    unit: p.unit,
    category: p.category,
  }));

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Hero Section */}
      <HeroAQICard
        aqi={data.current.aqi}
        updatedAt={formatRelativeTime(data.meta.generated_at)}
        nextUpdateIn={formatNextUpdate(data.meta.next_update_at)}
        pollutants={pollutants}
      />

      {/* Future homepage sections go here */}
    </div>
  );
}
