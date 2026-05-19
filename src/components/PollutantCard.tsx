import { getCategoryColorClass, getCategoryBgClass } from '../lib/aqi';

export interface PollutantData {
  id: string;
  name: string;
  value: number;
  unit?: string;
  category: string;
}

interface PollutantCardProps {
  data: PollutantData;
}

export default function PollutantCard({ data }: PollutantCardProps) {
  const colorClass = getCategoryColorClass(data.category);
  const bgClass = getCategoryBgClass(data.category);

  return (
    <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-[20px] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]">
      <span className="text-[13px] md:text-sm font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-2">
        {data.name}
      </span>
      <span className={`text-2xl md:text-3xl font-bold tracking-tight ${colorClass} mb-2`}>
        {data.value}
      </span>
      <div className={`px-3 py-1 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-wider ${colorClass} ${bgClass}`}>
        {data.category}
      </div>
    </div>
  );
}
