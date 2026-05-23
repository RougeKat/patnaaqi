/**
 * DeltaBadge — renders ↑ / ↓ / — next to a value to indicate
 * the direction of change since the last hourly update.
 *
 * Colour coding:
 *   ↑  amber  (higher = generally worse air quality)
 *   ↓  green  (lower  = generally better air quality)
 *   —  muted  (no change)
 */

interface DeltaBadgeProps {
  /** Numeric difference (current − previous). null = no previous data. */
  delta: number | null | undefined;
  className?: string;
}

export default function DeltaBadge({ delta, className = '' }: DeltaBadgeProps) {
  if (delta === null || delta === undefined) return null;

  if (delta === 0) {
    return (
      <span
        className={`font-semibold text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] ${className}`}
        aria-label="no change"
      >
        —
      </span>
    );
  }

  const isUp = delta > 0;
  return (
    <span
      className={`font-bold ${isUp ? 'text-[var(--color-aqi-moderate)]' : 'text-[var(--color-aqi-good)]'} ${className}`}
      aria-label={isUp ? 'increased' : 'decreased'}
    >
      {isUp ? '↑' : '↓'}
    </span>
  );
}
