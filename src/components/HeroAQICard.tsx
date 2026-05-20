import { getAqiCategory, getAqiColorClass, getAqiBgClass, getHealthAdvisory } from '../lib/aqi';
import { Clock } from 'lucide-react';
import AqiScaleBar from './AqiScaleBar';
import PollutantCard from './PollutantCard';
import type { PollutantData } from './PollutantCard';

interface HeroAQICardProps {
  aqi: number;
  updatedAt: string;
  nextUpdateIn: string;
  pollutants: PollutantData[];
}

export default function HeroAQICard({ aqi, updatedAt, nextUpdateIn, pollutants }: HeroAQICardProps) {
  const category = getAqiCategory(aqi);
  const colorClass = getAqiColorClass(aqi);
  const bgClass = getAqiBgClass(aqi);
  const advisory = getHealthAdvisory(aqi);

  return (
    <div className={`relative overflow-hidden rounded-[24px] p-6 md:p-8 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] shadow-sm bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] transition-colors duration-300`}>
      {/* Faint Background Tint overlay */}
      <div className={`absolute inset-0 opacity-[0.15] dark:opacity-10 ${bgClass} pointer-events-none`}></div>

      <div className="relative z-10 flex flex-col w-full">
        
        {/* Top Header: Timestamps */}
        <div className="flex flex-col items-start w-full mb-4">
          <div className="flex items-center gap-1.5 text-sm md:text-base font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
            <span>Updated {updatedAt}</span>
            <Clock size={16} className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] shrink-0" />
          </div>
          <span className={`text-xs md:text-sm font-bold mt-0.5 ${colorClass}`}>
            Next update {nextUpdateIn}
          </span>
        </div>

        {/* Hero AQI Section */}
        <div className="flex items-center gap-4 mt-2">
          <span className={`text-[80px] md:text-[120px] font-black tracking-tighter leading-none ${colorClass}`}>
            {aqi}
          </span>
          <div className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-lg md:text-xl font-bold uppercase tracking-wider ${colorClass} ${bgClass}`}>
            {category}
          </div>
        </div>

        {/* Advisory Text */}
        <p className="text-base md:text-lg font-medium text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mt-6 max-w-2xl">
          {advisory}
        </p>

        {/* Scale Bar */}
        <AqiScaleBar currentAqi={aqi} />

        {/* Pollutants Grid */}
        <div className="mt-8 md:mt-10 grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 w-full">
          {pollutants.map((pollutant) => (
            <PollutantCard key={pollutant.id} data={pollutant} />
          ))}
        </div>

      </div>
    </div>
  );
}
