import { ChartConfig } from '@/types';

// Default color palette for charts
export const chartColors = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  light: '#F3F4F6',
  dark: '#1F2937',
};

// Color palette arrays for multi-series charts
export const multiSeriesColors = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#06B6D4', // cyan-500
  '#EC4899', // pink-500
  '#84CC16', // lime-500
];

// KPI Category Colors
export const kpiCategoryColors = {
  patient_satisfaction: '#10B981', // emerald-500
  clinical_quality: '#3B82F6',     // blue-500
  operational_efficiency: '#F59E0B', // amber-500
  financial_performance: '#8B5CF6', // violet-500
  safety: '#EF4444',               // red-500
  staff_performance: '#06B6D4',    // cyan-500
};

// Default chart configurations
export const defaultChartConfigs: Record<string, Partial<ChartConfig>> = {
  line: {
    type: 'line',
    showGrid: true,
    showLegend: true,
    colors: [chartColors.primary],
  },
  bar: {
    type: 'bar',
    showGrid: true,
    showLegend: false,
    colors: multiSeriesColors,
  },
  area: {
    type: 'area',
    showGrid: true,
    showLegend: true,
    colors: [chartColors.primary],
  },
  pie: {
    type: 'pie',
    showLegend: true,
    colors: multiSeriesColors,
  },
  heatmap: {
    type: 'heatmap',
    showLegend: false,
    colors: ['#FEF3C7', '#FCD34D', '#F59E0B', '#D97706', '#92400E'],
  },
};

// Responsive chart dimensions
export const chartDimensions = {
  small: {
    width: '100%',
    height: 200,
  },
  medium: {
    width: '100%',
    height: 300,
  },
  large: {
    width: '100%',
    height: 400,
  },
  xl: {
    width: '100%',
    height: 500,
  },
};

// Chart animation configurations
export const chartAnimations = {
  default: {
    animationBegin: 0,
    animationDuration: 800,
    animationEasing: 'ease-out',
  },
  fast: {
    animationBegin: 0,
    animationDuration: 400,
    animationEasing: 'ease-out',
  },
  slow: {
    animationBegin: 0,
    animationDuration: 1200,
    animationEasing: 'ease-out',
  },
};

// Tooltip formatters
export const tooltipFormatters = {
  currency: (value: number) => `$${value.toLocaleString()}`,
  percentage: (value: number) => `${value.toFixed(1)}%`,
  number: (value: number) => value.toLocaleString(),
  time: (value: string) => new Date(value).toLocaleDateString(),
};

// Grid configurations
export const gridConfigs = {
  default: {
    strokeDasharray: '3 3',
    stroke: '#E5E7EB',
    strokeWidth: 1,
  },
  bold: {
    strokeDasharray: 'none',
    stroke: '#D1D5DB',
    strokeWidth: 1,
  },
  subtle: {
    strokeDasharray: '1 1',
    stroke: '#F3F4F6',
    strokeWidth: 1,
  },
};

// Legend configurations
export const legendConfigs = {
  bottom: {
    verticalAlign: 'bottom' as const,
    height: 36,
    iconType: 'circle' as const,
  },
  top: {
    verticalAlign: 'top' as const,
    height: 36,
    iconType: 'circle' as const,
  },
  right: {
    verticalAlign: 'middle' as const,
    align: 'right' as const,
    layout: 'vertical' as const,
    iconType: 'circle' as const,
  },
};

/**
 * Get chart configuration by type
 */
export function getChartConfig(type: keyof typeof defaultChartConfigs): Partial<ChartConfig> {
  return defaultChartConfigs[type] || defaultChartConfigs.line;
}

/**
 * Get color by KPI category
 */
export function getCategoryColor(category: keyof typeof kpiCategoryColors): string {
  return kpiCategoryColors[category] || chartColors.primary;
}

/**
 * Generate gradient colors for area charts
 */
export function generateGradient(color: string, id: string) {
  return {
    id,
    stops: [
      { offset: '5%', stopColor: color, stopOpacity: 0.8 },
      { offset: '95%', stopColor: color, stopOpacity: 0.1 },
    ],
  };
}