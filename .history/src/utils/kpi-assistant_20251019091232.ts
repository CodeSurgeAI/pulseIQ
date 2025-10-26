import {
  DashboardMetric,
  AiPrediction,
  AiAnomaly,
  AiRecommendation,
  User,
} from '@/types';
import {
  mockDashboardMetrics,
  mockAiPredictions,
  mockAiAnomalies,
  mockAiRecommendations,
} from '@/utils/mock-data';

export type AssistantPillar = 'operational_efficiency' | 'patient_care' | 'cost_control';

export interface AssistantSuggestion {
  id: string;
  pillar: AssistantPillar;
  title: string;
  summary: string;
  actions: string[];
  impactedKpis: {
    name: string;
    current?: number;
    target?: number;
    unit?: string;
    direction?: 'up' | 'down';
  }[];
  confidence?: number;
}

function pickMetric(metrics: DashboardMetric[], nameContains: string) {
  return metrics.find(m => m.kpiName.toLowerCase().includes(nameContains.toLowerCase()));
}

function round(n?: number) {
  if (n === undefined) return undefined;
  return Math.round((n + Number.EPSILON) * 10) / 10;
}

export interface AssistantContext {
  metrics: DashboardMetric[];
  predictions: AiPrediction[];
  anomalies: AiAnomaly[];
  recommendations: AiRecommendation[];
}

export function getAssistantContext(): AssistantContext {
  // In a real app, replace these with API calls or live stores.
  return {
    metrics: mockDashboardMetrics,
    predictions: mockAiPredictions,
    anomalies: mockAiAnomalies,
    recommendations: mockAiRecommendations,
  };
}

export function generateSuggestions(user?: User): AssistantSuggestion[] {
  const { metrics, predictions, anomalies, recommendations } = getAssistantContext();

  const waitTime = pickMetric(metrics, 'Wait Time');
  const satis = pickMetric(metrics, 'Satisfaction');
  const readmit = pickMetric(metrics, 'Readmission');
  const occupancy = pickMetric(metrics, 'Bed Occupancy');

  const criticalAnomaly = anomalies.find(a => a.severity === 'critical');
  const highPriorityRec = recommendations.find(r => r.priority === 'urgent' || r.priority === 'high');
  const nextMonthWaitPred = predictions.find(p => p.kpiName.includes('Wait Time'));

  const suggestions: AssistantSuggestion[] = [];

  // Operational efficiency
  suggestions.push({
    id: 'ops-1',
    pillar: 'operational_efficiency',
    title: 'Reduce wait times and improve patient flow',
    summary:
      `Current average wait time is ${waitTime?.currentValue ?? '—'} ${waitTime?.unit ?? ''}. ` +
      (nextMonthWaitPred
        ? `Forecast suggests ${round(nextMonthWaitPred.predictedValue)} ${waitTime?.unit ?? ''} next period (confidence ${round(nextMonthWaitPred.confidence)}%).`
        : ''),
    actions: [
      'Activate fast-track triage for low-acuity cases during peak hours.',
      'Rebalance staff rosters based on hourly arrival patterns (last 30 days).',
      'Enable bed-turnover alerts once discharge orders are signed to shorten boarding time.',
    ],
    impactedKpis: [
      {
        name: 'Average Wait Time',
        current: waitTime?.currentValue,
        target: waitTime?.targetValue,
        unit: waitTime?.unit,
        direction: 'down',
      },
      {
        name: 'Bed Occupancy',
        current: occupancy?.currentValue,
        target: occupancy?.targetValue,
        unit: occupancy?.unit,
        direction: 'up',
      },
    ],
    confidence: 0.86,
  });

  // Patient care
  suggestions.push({
    id: 'care-1',
    pillar: 'patient_care',
    title: 'Lower readmissions with strengthened discharge and follow-up',
    summary:
      `Readmission rate is ${readmit?.currentValue ?? '—'}${readmit?.unit ?? ''}. ` +
      (criticalAnomaly ? `A recent anomaly was detected in ${criticalAnomaly.kpiName} (severity: ${criticalAnomaly.severity}). ` : '') +
      'Focus on high-risk cohorts at discharge.',
    actions: [
      'Launch a nurse-led 48-hour post-discharge call program for high-risk patients.',
      'Provide simplified discharge instructions and medication reconciliation at bedside.',
      'Schedule follow-up appointments before discharge; send SMS reminders.',
    ],
    impactedKpis: [
      {
        name: 'Readmission Rate',
        current: readmit?.currentValue,
        target: readmit?.targetValue,
        unit: readmit?.unit,
        direction: 'down',
      },
      {
        name: 'Patient Satisfaction',
        current: satis?.currentValue,
        target: satis?.targetValue,
        unit: satis?.unit,
        direction: 'up',
      },
    ],
    confidence: 0.9,
  });

  // Cost control
  suggestions.push({
    id: 'cost-1',
    pillar: 'cost_control',
    title: 'Control costs via smarter staffing and supply usage',
    summary:
      'Align staffing to demand curves and reduce non-value supplies usage without impacting care quality.',
    actions: [
      'Adopt demand-based float pool scheduling for weekends and evenings.',
      'Standardize high-cost consumables; enforce formulary for common procedures.',
      'Enable exception alerts for outlier length-of-stay vs DRG benchmarks.',
    ],
    impactedKpis: [
      { name: 'Average Wait Time', current: waitTime?.currentValue, target: waitTime?.targetValue, unit: waitTime?.unit, direction: 'down' },
      { name: 'Bed Occupancy', current: occupancy?.currentValue, target: occupancy?.targetValue, unit: occupancy?.unit, direction: 'up' },
    ],
    confidence: 0.82,
  });

  // If there is a high/urgent recommendation, surface it first
  if (highPriorityRec) {
    const first = suggestions[0];
    const urgent: AssistantSuggestion = {
      id: `rec-${highPriorityRec.id}`,
      pillar: 'patient_care',
      title: highPriorityRec.title,
      summary: highPriorityRec.description,
      actions: highPriorityRec.implementationSteps.slice(0, 4),
      impactedKpis: highPriorityRec.estimatedImpact.map(e => ({
        name: highPriorityRec.targetKpis.includes('3') ? 'Readmission Rate' : 'Target KPI',
        current: round(e.currentValue),
        target: round(e.projectedValue),
        unit: '%',
        direction: 'down',
      })),
      confidence: highPriorityRec.confidence / 100,
    };
    return [urgent, first, ...suggestions.filter(s => s.id !== first.id)];
  }

  return suggestions;
}

export function answerLeadershipQuestion(question: string): string {
  const q = question.toLowerCase();
  const { metrics } = getAssistantContext();
  const waitTime = pickMetric(metrics, 'Wait Time');
  const satis = pickMetric(metrics, 'Satisfaction');
  const readmit = pickMetric(metrics, 'Readmission');
  const occupancy = pickMetric(metrics, 'Bed Occupancy');

  if (q.includes('readmission') || q.includes('re-admission')) {
    return `Our current readmission rate is ${readmit?.currentValue}${readmit?.unit ?? ''} vs target ${readmit?.targetValue}${readmit?.unit ?? ''}. To reduce this, prioritize a 48-hour post-discharge call for high-risk patients, schedule follow-ups before discharge, and provide simplified medication reconciliation at bedside. These steps typically lower readmissions by 20–30% within 6–8 weeks.`;
  }
  if (q.includes('wait') || q.includes('throughput') || q.includes('flow')) {
    return `Average wait time is ${waitTime?.currentValue} ${waitTime?.unit}. Implement fast-track triage for low-acuity cases and align staffing to peak arrival hours. Also, enable auto bed-turnover alerts once discharge orders are signed to cut boarding time.`;
  }
  if (q.includes('occupancy') || q.includes('beds')) {
    return `Bed occupancy is ${occupancy?.currentValue}${occupancy?.unit ?? '%'} with a target of ${occupancy?.targetValue}${occupancy?.unit ?? '%'}.
Optimizing discharge-before-noon and predictive bed allocation can raise effective capacity by 3–6% without adding physical beds.`;
  }
  if (q.includes('satisfaction') || q.includes('experience') || q.includes('hca')) {
    return `Patient satisfaction is ${satis?.currentValue} (target ${satis?.targetValue}). Quick wins: bedside rounding at shift changes, proactive communication about delays, and post-visit SMS feedback loops with rapid service recovery for low ratings.`;
  }
  if (q.includes('cost') || q.includes('spend') || q.includes('expense')) {
    return 'Top cost levers: demand-based staffing to trim overtime, standardizing consumables for common procedures, and early escalation when length-of-stay exceeds DRG benchmarks.';
  }
  if (q.includes('staff')) {
    return 'Use arrival-pattern heatmaps to align RN and provider schedules to demand. Consider a float pool for weekends/evenings and cross-train to reduce agency dependence.';
  }

  return 'I can help with wait times, bed occupancy, readmissions, patient satisfaction, staffing, and cost controls. What would you like to focus on?';
}
