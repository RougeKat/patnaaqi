import { getAqiColorClass } from '../lib/aqi';

interface AqiScaleBarProps {
  currentAqi: number;
}

export default function AqiScaleBar({ currentAqi }: AqiScaleBarProps) {
  // Clamp AQI to 500 for the bar position
  const clampedAqi = Math.min(Math.max(currentAqi, 0), 500);
  const percentage = (clampedAqi / 500) * 100;
  const pointerColor = getAqiColorClass(clampedAqi);

  const segments = [
    { color: 'bg-[var(--color-aqi-good)]', weight: 1 }, // 0-50
    { color: 'bg-[var(--color-aqi-satisfactory)]', weight: 1 }, // 51-100
    { color: 'bg-[var(--color-aqi-moderate)]', weight: 2 }, // 101-200
    { color: 'bg-[var(--color-aqi-poor)]', weight: 2 }, // 201-300
    { color: 'bg-[var(--color-aqi-very-poor)]', weight: 2 }, // 301-400
    { color: 'bg-[var(--color-aqi-severe)]', weight: 2 }, // 401-500
  ];

  return (
    <div className="w-full max-w-lg mx-auto md:mx-0 mt-6 md:mt-8">
      {/* Pointer Container */}
      <div className="relative w-full h-4 mb-1">
        <div 
          className="absolute top-0 -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: `${percentage}%` }}
        >
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={pointerColor}>
            <path d="M7 12L0.937823 0L13.0622 0L7 12Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Segments Bar */}
      <div className="flex w-full h-2 rounded-full overflow-hidden gap-0.5">
        {segments.map((seg, idx) => (
          <div key={idx} className={`${seg.color} h-full`} style={{ flex: seg.weight }}></div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between w-full text-[11px] md:text-xs font-semibold text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] mt-2">
        <span>0</span>
        <span>50</span>
        <span>100</span>
        <span>200</span>
        <span>300</span>
        <span>400</span>
        <span>500</span>
      </div>
    </div>
  );
}
