/**
 * Returns a human-readable relative time string for a past ISO 8601 timestamp.
 * Example: "5 minutes ago", "2 hours ago"
 */
export function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) return 'just now';
  if (diffMins === 1) return '1 minute ago';
  if (diffMins < 60) return `${diffMins} minutes ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  return `${diffHours} hours ago`;
}

/**
 * Returns a compact countdown string for a future ISO 8601 timestamp.
 * Example: "25m", "1h 10m"
 */
export function formatNextUpdate(isoString: string): string {
  const diffMs = new Date(isoString).getTime() - Date.now();
  const diffMins = Math.ceil(diffMs / 60_000);

  if (diffMins <= 0) return 'soon';
  if (diffMins < 60) return `in ${diffMins}m`;

  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return mins > 0 ? `in ${hours}h ${mins}m` : `in ${hours}h`;
}
