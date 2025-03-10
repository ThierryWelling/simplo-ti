'use client';

import { IconType } from 'react-icons';
import GlassmorphismContainer from './GlassmorphismContainer';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: {
    value: number;
    isUpward: boolean;
  };
}

export default function MetricCard({ title, value, icon: Icon, trend }: MetricCardProps) {
  return (
    <GlassmorphismContainer variant="primary" className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-wider text-zinc-600 font-medium mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-zinc-800">
            {value}
          </h3>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend.isUpward ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isUpward ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-zinc-500 ml-1">vs último mês</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-zinc-100 rounded-lg">
          <Icon size={24} className="text-zinc-600" />
        </div>
      </div>
    </GlassmorphismContainer>
  );
} 