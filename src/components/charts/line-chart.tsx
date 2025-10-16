'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Dot,
} from 'recharts';
import { ChartDataPoint } from '@/types';
import { chartColors, chartDimensions } from '@/utils/chart-config';

interface LineChartComponentProps {
  data: ChartDataPoint[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showTarget?: boolean;
  color?: string;
  height?: 'small' | 'medium' | 'large' | 'xl';
  className?: string;
  onPointClick?: (data: ChartDataPoint, index: number) => void;
  interactive?: boolean;
}

export function LineChartComponent({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  showTarget = true,
  color = chartColors.primary,
  height = 'medium',
  className,
  onPointClick,
  interactive = true,
}: LineChartComponentProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const chartHeight = chartDimensions[height].height;

  const handlePointClick = (data: ChartDataPoint, index: number) => {
    if (interactive && onPointClick) {
      onPointClick(data, index);
    }
  };

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
          {showTarget && (
            <Line
              type="monotone"
              dataKey="target"
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      {(xAxisLabel || yAxisLabel) && (
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>{xAxisLabel}</span>
          <span>{yAxisLabel}</span>
        </div>
      )}
      {interactive && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Click on data points for detailed analysis
        </p>
      )}
    </div>
  );
}