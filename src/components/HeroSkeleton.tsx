// A shimmer skeleton that mirrors the layout of HeroAQICard.
// Shown while /data/aqi.json is being fetched.
const Shimmer = ({ className }: { className: string }) => (
  <div
    className={`rounded-full bg-[var(--color-surface-secondary-light)] dark:bg-[var(--color-surface-secondary-dark)] ${className}`}
  />
);

export default function HeroSkeleton() {
  return (
    <div
      className="relative overflow-hidden rounded-[24px] p-6 md:p-8 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] shadow-sm bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] animate-pulse"
      aria-busy="true"
      aria-label="Loading air quality data"
    >
      {/* Timestamp row */}
      <Shimmer className="h-5 w-44 mb-2" />
      <Shimmer className="h-4 w-32 mt-2" />

      {/* AQI number + category badge */}
      <div className="flex items-center gap-4 mt-6">
        <div className="h-24 md:h-32 w-40 md:w-52 rounded-2xl bg-[var(--color-surface-secondary-light)] dark:bg-[var(--color-surface-secondary-dark)]" />
        <div className="h-10 w-32 rounded-full bg-[var(--color-surface-secondary-light)] dark:bg-[var(--color-surface-secondary-dark)]" />
      </div>

      {/* Advisory text */}
      <div className="mt-6 space-y-2 max-w-2xl">
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-4/5" />
      </div>

      {/* Scale bar area */}
      <div className="mt-8 max-w-lg">
        <div className="h-2 w-full rounded-full bg-[var(--color-surface-secondary-light)] dark:bg-[var(--color-surface-secondary-dark)]" />
      </div>

      {/* Pollutant cards grid */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-[20px] bg-[var(--color-surface-secondary-light)] dark:bg-[var(--color-surface-secondary-dark)]"
          />
        ))}
      </div>
    </div>
  );
}
