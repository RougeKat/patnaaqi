/**
 * DeltaBadge — renders ↑ / ↓ / — next to a value to indicate
 * the direction of change since the last hourly update.
 * The colour is inherited from the parent via `colorClass`
 * so the indicator always matches the value it sits beside.
 */

interface DeltaBadgeProps {
  /** Numeric difference (current − previous). null = no previous data. */
  delta: number | null | undefined;
  /** Tailwind colour class from the parent (e.g. getAqiColorClass result). */
  colorClass: string;
  className?: string;
}

export default function DeltaBadge({ delta, colorClass, className = '' }: DeltaBadgeProps) {
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

  return (
    <span
      className={`font-bold ${colorClass} ${className}`}
      aria-label={delta > 0 ? 'increased' : 'decreased'}
    >
      {delta > 0 ? '↑' : '↓'}
    </span>
  );
}
