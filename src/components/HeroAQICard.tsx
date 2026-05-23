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

        {/* ══ MOBILE layout (hidden on md+) ══
            Order: timestamps → AQI number → scale bar → advisory */}
        <div className="flex flex-col gap-4 md:hidden">

          {/* 1. Timestamps */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
              <span>Updated {updatedAt}</span>
              <Clock size={16} className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] shrink-0" />
            </div>
            <span className={`text-xs font-bold mt-0.5 ${colorClass}`}>
              {nextUpdateIn === 'soon' ? 'Next update soon' : 'Updates hourly'}
            </span>
          </div>

          {/* 2. AQI number + badge */}
          <div className="flex flex-col items-center gap-3 py-2">
            <span className={`text-[100px] font-black tracking-tighter leading-none ${colorClass}`} style={{ textShadow: '0 0 60px currentColor' }}>
              {aqi}
            </span>
            <div className={`px-5 py-2 rounded-full text-lg font-bold uppercase tracking-wider ${colorClass} ${bgClass}`}>
              {category}
            </div>
          </div>

          {/* 3. Scale bar */}
          <AqiScaleBar currentAqi={aqi} />

          {/* 4. Advisory */}
          <p className="text-base font-medium text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] leading-relaxed">
            {advisory}
          </p>

        </div>

        {/* ══ DESKTOP layout (hidden below md) ══
            Two columns: left (timestamps + advisory + scale bar) | right (AQI number) */}
        <div className="hidden md:flex md:flex-row md:items-stretch gap-8 w-full">

          {/* Left column */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex flex-col items-start mb-4">
              <div className="flex items-center gap-1.5 text-base font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                <span>Updated {updatedAt}</span>
                <Clock size={16} className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] shrink-0" />
              </div>
              <span className={`text-sm font-bold mt-0.5 ${colorClass}`}>
                {nextUpdateIn === 'soon' ? 'Next update soon' : 'Updates hourly'}
              </span>
            </div>
            <p className="text-lg font-medium text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] leading-relaxed flex-1">
              {advisory}
            </p>
            <AqiScaleBar currentAqi={aqi} />
          </div>

          {/* Vertical divider */}
          <div className="w-px self-stretch bg-[var(--color-border-light)] dark:bg-[var(--color-border-dark)] opacity-60 shrink-0" />

          {/* Right column */}
          <div className="flex flex-col items-center justify-center gap-4 min-w-[220px] px-4">
            <span className={`text-[130px] font-black tracking-tighter leading-none ${colorClass}`} style={{ textShadow: '0 0 60px currentColor' }}>
              {aqi}
            </span>
            <div className={`px-6 py-2.5 rounded-full text-xl font-bold uppercase tracking-wider ${colorClass} ${bgClass}`}>
              {category}
            </div>
          </div>

        </div>

        {/* ── Pollutants Grid — full width on both layouts ── */}
        <div className="mt-8 md:mt-10 grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 w-full">
          {pollutants.map((pollutant) => (
            <PollutantCard key={pollutant.id} data={pollutant} />
          ))}
        </div>

      </div>
    </div>
  );
}
