'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartDataPoint } from '@/types';
import { chartColors, chartDimensions, multiSeriesColors } from '@/utils/chart-config';

interface BarChartComponentProps {
  data: ChartDataPoint[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  colors?: string[];
  height?: 'small' | 'medium' | 'large' | 'xl';
  className?: string;
  onBarClick?: (data: ChartDataPoint, index: number) => void;
  interactive?: boolean;
}

export function BarChartComponent({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  color = chartColors.primary,
  colors = multiSeriesColors,
  height = 'medium',
  className,
  onBarClick,
  interactive = true,
}: BarChartComponentProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const chartHeight = chartDimensions[height].height;

  const handleBarClick = (data: unknown, index: number) => {
    if (interactive && onBarClick && data && typeof data === 'object' && 'payload' in data) {
      onBarClick((data as { payload: ChartDataPoint }).payload, index);
    }
  };

  const handleBarHover = (data: unknown, index: number) => {
    if (interactive) {
      setActiveIndex(index);
    }
  };

  const handleBarLeave = () => {
    if (interactive) {
      setActiveIndex(-1);
    }
  };

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: '#374151', fontWeight: 'medium' }}
            cursor={interactive ? { fill: 'rgba(59, 130, 246, 0.1)' } : false}
          />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
            cursor={interactive ? 'pointer' : 'default'}
            onClick={handleBarClick}
            onMouseEnter={handleBarHover}
            onMouseLeave={handleBarLeave}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length] || color}
                opacity={interactive && activeIndex >= 0 && activeIndex !== index ? 0.6 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {(xAxisLabel || yAxisLabel) && (
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>{xAxisLabel}</span>
          <span>{yAxisLabel}</span>
        </div>
      )}
      {interactive && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Click on bars for detailed analysis
        </p>
      )}
    </div>
  );
}