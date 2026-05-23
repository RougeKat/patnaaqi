import { getAqiCategory, getAqiColorClass, getAqiBgClass, getHealthAdvisory } from '../lib/aqi';
import { Clock } from 'lucide-react';
import AqiScaleBar from './AqiScaleBar';
import PollutantCard from './PollutantCard';
import DeltaBadge from './DeltaBadge';
import type { PollutantData } from './PollutantCard';

interface HeroAQICardProps {
  aqi: number;
  aqiDelta?: number | null;
  updatedAt: string;
  nextUpdateIn: string;
  pollutants: PollutantData[];
}

export default function HeroAQICard({ aqi, aqiDelta, updatedAt, nextUpdateIn, pollutants }: HeroAQICardProps) {
  const category = getAqiCategory(aqi);
  const colorClass = getAqiColorClass(aqi);
  const bgClass = getAqiBgClass(aqi);
  const advisory = getHealthAdvisory(aqi);

  return (
    <div className={`relative overflow-hidden rounded-[24px] p-6 md:p-8 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] shadow-sm bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] transition-colors duration-300`}>
      {/* Faint background tint */}
      <div className={`absolute inset-0 opacity-[0.15] dark:opacity-10 ${bgClass} pointer-events-none`} />

      {/*
        Single DOM tree — CSS Grid repositions for desktop, flex-col for mobile.
        Mobile visual order = DOM order: timestamps → AQI → scale bar → advisory.
        Desktop: Grid places timestamps/advisory/scalebar left, AQI right.
      */}
      <div className="relative z-10
        flex flex-col gap-4
        md:grid md:gap-x-8 md:gap-y-0
        md:[grid-template-areas:'ts_div_aqi'_'advisory_div_aqi'_'scalebar_div_aqi']
        md:[grid-template-columns:1fr_1px_220px]
        md:[grid-template-rows:auto_1fr_auto]">

        {/* 1 — Timestamps */}
        <div className="md:[grid-area:ts]">
          <div className="flex items-center gap-1.5 text-sm md:text-base font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
            <span>Updated {updatedAt}</span>
            <Clock size={16} className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] shrink-0" />
          </div>
          <span className={`text-xs md:text-sm font-bold mt-0.5 block ${colorClass}`}>
            {nextUpdateIn === 'soon' ? 'Next update soon' : 'Updates hourly'}
          </span>
        </div>

        {/* 2 — AQI number + badge (top on mobile, right column on desktop) */}
        <div className="flex flex-col items-center justify-center gap-3 py-2 md:py-0 md:[grid-area:aqi]">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-[100px] md:text-[130px] font-black tracking-tighter leading-none ${colorClass}`}
              style={{ textShadow: '0 0 60px currentColor' }}
            >
              {aqi}
            </span>
            <DeltaBadge delta={aqiDelta} className="text-4xl md:text-5xl" />
          </div>
          <div className={`px-5 py-2 md:px-6 md:py-2.5 rounded-full text-lg md:text-xl font-bold uppercase tracking-wider ${colorClass} ${bgClass}`}>
            {category}
          </div>
        </div>

        {/* 3 — Scale bar */}
        <div className="md:[grid-area:scalebar]">
          <AqiScaleBar currentAqi={aqi} />
        </div>

        {/* 4 — Advisory */}
        <p className="text-base md:text-lg font-medium text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] leading-relaxed md:[grid-area:advisory] md:self-start md:pt-2">
          {advisory}
        </p>

        {/* Vertical divider — desktop only, rendered via CSS grid area */}
        <div className="hidden md:block md:[grid-area:div] md:w-px md:self-stretch md:bg-[var(--color-border-light)] dark:md:bg-[var(--color-border-dark)] md:opacity-60" />

      </div>

      {/* Pollutants grid — full width on both layouts */}
      <div className="relative z-10 mt-8 md:mt-10 grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
        {pollutants.map((pollutant) => (
          <PollutantCard key={pollutant.id} data={pollutant} />
        ))}
      </div>
    </div>
  );
}
