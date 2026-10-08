import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  delta?: {
    value: string;
    isPositive: boolean;
    periodLabel?: string;
  };
  subtitle?: string;
  icon?: LucideIcon;
  sparklineData?: number[];
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  delta,
  subtitle,
  icon: Icon,
  sparklineData = [12, 18, 15, 25, 22, 35, 42],
  iconColor = 'text-teal-600 bg-teal-50 dark:bg-teal-950/50',
}) => {
  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Sparkline mini chart */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-20 h-9">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
              <path
                d={generateSparklinePath(sparklineData, 100, 30)}
                fill="none"
                stroke="#0d9488"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {delta && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs">
          <span
            className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded-md mr-1.5 ${delta.isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
              }`}
          >
            {delta.isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1 inline" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1 inline" />
            )}
            {delta.value}
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {delta.periodLabel || 'vs previous period'}
          </span>
        </div>
      )}
    </div>
  );
};

function generateSparklinePath(data: number[], width: number, height: number): string {
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / (max - min || 1)) * (height - 6) - 3;
    return `${x},${y}`;
  });
  return `M ${points.join(' L ')}`;
}
