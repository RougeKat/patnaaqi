import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ForecastHour } from '../types/aqi';
import { getCategoryColorClass, getCategoryBgClass } from '../lib/aqi';

// Pollutant AQI band classification for tooltip color highlighting
function getPollutantCategory(pollutant: string, value: number): string {
  if (pollutant === 'pm25') {
    if (value <= 30) return 'Good';
    if (value <= 60) return 'Satisfactory';
    if (value <= 90) return 'Moderate';
    if (value <= 120) return 'Poor';
    if (value <= 250) return 'Very Poor';
    return 'Severe';
  }
  if (pollutant === 'pm10') {
    if (value <= 50) return 'Good';
    if (value <= 100) return 'Satisfactory';
    if (value <= 250) return 'Moderate';
    if (value <= 350) return 'Poor';
    if (value <= 430) return 'Very Poor';
    return 'Severe';
  }
  if (pollutant === 'no2') {
    if (value <= 40) return 'Good';
    if (value <= 80) return 'Satisfactory';
    if (value <= 180) return 'Moderate';
    if (value <= 280) return 'Poor';
    if (value <= 400) return 'Very Poor';
    return 'Severe';
  }
  if (pollutant === 'o3') {
    if (value <= 50) return 'Good';
    if (value <= 100) return 'Satisfactory';
    if (value <= 168) return 'Moderate';
    if (value <= 208) return 'Poor';
    if (value <= 748) return 'Very Poor';
    return 'Severe';
  }
  return 'Good';
}

interface ForecastChartProps {
  hourlyData: ForecastHour[];
}

const pollutantTabs = [
  { id: 'pm25', name: 'PM2.5', label: 'PM2.5' },
  { id: 'pm10', name: 'PM10', label: 'PM10' },
  { id: 'no2', name: 'no2', label: 'NO₂' },
  { id: 'o3', name: 'o3', label: 'O₃' },
];

export default function ForecastChart({ hourlyData }: ForecastChartProps) {
  const [selectedPollutant, setSelectedPollutant] = useState<string>('pm25');

  // Format the time labels on the X-axis
  const formatXAxis = (isoString: string, index: number) => {
    try {
      const date = new Date(isoString);
      const hour = date.getHours().toString().padStart(2, '0');
      const min = date.getMinutes().toString().padStart(2, '0');

      // On the first tick and at midnight (00:00), display the date label
      if (index === 0 || (date.getHours() === 0 && date.getMinutes() === 0)) {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        return `${day} ${month}`;
      }

      return `${hour}:${min}`;
    } catch {
      return isoString;
    }
  };

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      if (value === null || value === undefined) return null;

      const date = new Date(label || '');
      const formattedDate = date.toLocaleString('default', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const category = getPollutantCategory(selectedPollutant, value);
      const categoryColorClass = getCategoryColorClass(category);
      const categoryBgClass = getCategoryBgClass(category);

      return (
        <div className="rounded-[16px] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-[var(--color-surface-light)]/95 dark:bg-[var(--color-surface-dark)]/95 p-4 shadow-lg backdrop-blur-sm">
          <p className="text-[12px] font-semibold text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
            {formattedDate}
          </p>
          <div className="mt-2 flex items-center justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] uppercase tracking-wider">
                Predicted level
              </span>
              <span className="text-[20px] font-extrabold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                {value} <span className="text-xs font-normal">µg/m³</span>
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${categoryColorClass} ${categoryBgClass}`}>
              {category}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-[24px] p-6 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] shadow-sm transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
            48-Hour Forecast
          </h3>
          <p className="text-sm text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] mt-1">
            Predicted concentrations in micrograms per cubic meter (µg/m³)
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex items-center bg-[var(--color-surface-secondary-light)] dark:bg-[var(--color-surface-secondary-dark)] p-1 rounded-xl self-start md:self-auto border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]/50">
          {pollutantTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPollutant(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
                selectedPollutant === tab.id
                  ? 'bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] text-[var(--color-accent-light)] dark:text-[var(--color-accent-dark)] shadow-sm'
                  : 'text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] hover:text-[var(--color-text-primary-light)] dark:hover:text-[var(--color-text-primary-dark)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-[320px] -ml-2 text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={hourlyData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPollutant" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.25} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border-light)"
              className="dark:stroke-[var(--color-border-dark)] opacity-40"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              tickFormatter={formatXAxis}
              stroke="currentColor"
              tickLine={false}
              axisLine={false}
              dy={10}
              className="text-[10px] md:text-[11px] font-semibold text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]"
              interval={4} // Shows tick every 5 hours for clarity on mobile/desktop
            />

            <YAxis
              stroke="currentColor"
              tickLine={false}
              axisLine={false}
              dx={-5}
              className="text-[10px] md:text-[11px] font-semibold text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]"
              domain={['auto', 'auto']}
              padding={{ top: 20, bottom: 10 }}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', className: 'text-[var(--color-border-light)] dark:text-[var(--color-border-dark)]' }} />

            <Area
              type="monotone"
              dataKey={selectedPollutant}
              stroke="currentColor"
              strokeWidth={2.5}
              fill="url(#colorPollutant)"
              className="text-[var(--color-accent-light)] dark:text-[var(--color-accent-dark)]"
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
