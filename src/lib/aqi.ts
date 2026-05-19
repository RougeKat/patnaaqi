export function getAqiCategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

export function getAqiColorClass(aqi: number): string {
  if (aqi <= 50) return 'text-[var(--color-aqi-good)]';
  if (aqi <= 100) return 'text-[var(--color-aqi-satisfactory)]';
  if (aqi <= 200) return 'text-[var(--color-aqi-moderate)]';
  if (aqi <= 300) return 'text-[var(--color-aqi-poor)]';
  if (aqi <= 400) return 'text-[var(--color-aqi-very-poor)]';
  return 'text-[var(--color-aqi-severe)]';
}

export function getAqiBgClass(aqi: number): string {
  // Using Tailwind v4 syntax for arbitrary background color with opacity modifier.
  if (aqi <= 50) return 'bg-[var(--color-aqi-good)]/10 dark:bg-[var(--color-aqi-good)]/15';
  if (aqi <= 100) return 'bg-[var(--color-aqi-satisfactory)]/10 dark:bg-[var(--color-aqi-satisfactory)]/15';
  if (aqi <= 200) return 'bg-[var(--color-aqi-moderate)]/10 dark:bg-[var(--color-aqi-moderate)]/15';
  if (aqi <= 300) return 'bg-[var(--color-aqi-poor)]/10 dark:bg-[var(--color-aqi-poor)]/15';
  if (aqi <= 400) return 'bg-[var(--color-aqi-very-poor)]/10 dark:bg-[var(--color-aqi-very-poor)]/15';
  return 'bg-[var(--color-aqi-severe)]/10 dark:bg-[var(--color-aqi-severe)]/15';
}

export function getCategoryColorClass(category: string): string {
  switch(category.toLowerCase()) {
    case 'good': return 'text-[var(--color-aqi-good)]';
    case 'satisfactory': return 'text-[var(--color-aqi-satisfactory)]';
    case 'moderate': return 'text-[var(--color-aqi-moderate)]';
    case 'poor': return 'text-[var(--color-aqi-poor)]';
    case 'very poor': return 'text-[var(--color-aqi-very-poor)]';
    case 'severe': return 'text-[var(--color-aqi-severe)]';
    default: return 'text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]';
  }
}

export function getCategoryBgClass(category: string): string {
  switch(category.toLowerCase()) {
    case 'good': return 'bg-[var(--color-aqi-good)]/10 dark:bg-[var(--color-aqi-good)]/15';
    case 'satisfactory': return 'bg-[var(--color-aqi-satisfactory)]/10 dark:bg-[var(--color-aqi-satisfactory)]/15';
    case 'moderate': return 'bg-[var(--color-aqi-moderate)]/10 dark:bg-[var(--color-aqi-moderate)]/15';
    case 'poor': return 'bg-[var(--color-aqi-poor)]/10 dark:bg-[var(--color-aqi-poor)]/15';
    case 'very poor': return 'bg-[var(--color-aqi-very-poor)]/10 dark:bg-[var(--color-aqi-very-poor)]/15';
    case 'severe': return 'bg-[var(--color-aqi-severe)]/10 dark:bg-[var(--color-aqi-severe)]/15';
    default: return 'bg-[var(--color-surface-secondary-light)] dark:bg-[var(--color-surface-secondary-dark)]';
  }
}

export function getHealthAdvisory(aqi: number): string {
  if (aqi <= 50) return 'Air quality is satisfactory, and air pollution poses little or no risk.';
  if (aqi <= 100) return 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.';
  if (aqi <= 200) return 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.';
  if (aqi <= 300) return 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.';
  if (aqi <= 400) return 'Health alert: The risk of health effects is increased for everyone.';
  return 'Health warning of emergency conditions: everyone is more likely to be affected.';
}
