'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  Target, 
  BarChart3, 
  PieChart,
  Brain,
  Shield,
  Zap,
  Activity,
  Timer,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Plus,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Building,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Calculator,
  Briefcase,
  Receipt,
  Percent,
  Award,
  Star,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChartComponent } from '@/components/charts/line-chart';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { useAlert } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { useTimeoutManager } from '@/hooks/use-timeout-manager';

// Types for Financial Performance & Revenue Optimization
export interface ValueBasedContract {
  id: string;
  payerName: string;
  contractType: 'ACO' | 'Bundled Payment' | 'Capitation' | 'Shared Savings' | 'Risk Sharing';
  startDate: Date;
  endDate: Date;
  totalLives: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  currentPerformance: {
    qualityScore: number; // 0-100
    costPerMember: number;
    savingsGenerated: number;
    bonusPayments: number;
    penaltyRisk: number;
  };
  targets: {
    qualityThreshold: number;
    costTarget: number;
    savingsTarget: number;
  };
  status: 'Performing' | 'At Risk' | 'Underperforming';
  aiRecommendations: string[];
}

export interface PayerNegotiation {
  id: string;
  payerName: string;
  contractValue: number;
  renewalDate: Date;
  currentRates: {
    inpatientDRG: number;
    outpatientAPC: number;
    professionalRVU: number;
  };
  benchmarkRates: {
    inpatientDRG: number;
    outpatientAPC: number;
    professionalRVU: number;
  };
  negotiationOpportunity: number; // percentage increase potential
  riskFactors: string[];
  leveragePoints: string[];
  aiInsights: string[];
  priority: 'High' | 'Medium' | 'Low';
}

export interface DenialPrediction {
  id: string;
  claimId: string;
  patientId: string;
  serviceDate: Date;
  payerName: string;
  claimAmount: number;
  drgCode: string;
  denialRiskScore: number; // 0-100
  riskFactors: {
    factor: string;
    weight: number;
    impact: 'High' | 'Medium' | 'Low';
  }[];
  recommendations: string[];
  preventionActions: string[];
  appealStrategy?: string[];
  status: 'Submitted' | 'Under Review' | 'Denied' | 'Paid' | 'Appeal Pending';
}

export interface CostPerEpisode {
  id: string;
  drgCode: string;
  drgDescription: string;
  episodeCount: number;
  averageCost: number;
  averageReimbursement: number;
  margin: number;
  marginPercentage: number;
  qualityMetrics: {
    readmissionRate: number;
    complicationRate: number;
    lengthOfStay: number;
    patientSatisfaction: number;
  };
  benchmark: {
    nationalAverage: number;
    peerAverage: number;
    topPerformer: number;
  };
  improvementOpportunity: number;
  aiOptimizations: string[];
}

export interface FinancialMetrics {
  totalRevenue: number;
  netRevenue: number;
  operatingMargin: number;
  denialRate: number;
  daysInAR: number;
  contractedAdjustments: number;
  valueBasedRevenue: number;
  feeForServiceRevenue: number;
  averageReimbursement: number;
  costPerCase: number;
  qualityBonuses: number;
  penaltyCharges: number;
  monthlyROI: number;
}

// Mock Data
const mockValueBasedContracts: ValueBasedContract[] = [
  {
    id: '1',
    payerName: 'Medicare Advantage ACO',
    contractType: 'ACO',
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2026, 11, 31),
    totalLives: 25000,
    riskLevel: 'Medium',
    currentPerformance: {
      qualityScore: 87,
      costPerMember: 485,
      savingsGenerated: 2400000,
      bonusPayments: 850000,
      penaltyRisk: 0
    },
    targets: {
      qualityThreshold: 85,
      costTarget: 500,
      savingsTarget: 2000000
    },
    status: 'Performing',
    aiRecommendations: [
      'Focus on diabetes management programs to improve quality scores',
      'Optimize specialist referrals to reduce cost per member',
      'Implement care coordination for high-risk patients'
    ]
  },
  {
    id: '2',
    payerName: 'Blue Cross Bundled Payment',
    contractType: 'Bundled Payment',
    startDate: new Date(2024, 6, 1),
    endDate: new Date(2025, 5, 31),
    totalLives: 8500,
    riskLevel: 'High',
    currentPerformance: {
      qualityScore: 82,
      costPerMember: 1250,
      savingsGenerated: -150000,
      bonusPayments: 0,
      penaltyRisk: 75000
    },
    targets: {
      qualityThreshold: 90,
      costTarget: 1200,
      savingsTarget: 500000
    },
    status: 'At Risk',
    aiRecommendations: [
      'Urgent: Reduce surgical complications to improve quality',
      'Optimize length of stay for hip/knee replacements',
      'Enhance post-discharge care coordination',
      'Review surgeon performance and protocols'
    ]
  }
];

const mockPayerNegotiations: PayerNegotiation[] = [
  {
    id: '1',
    payerName: 'Anthem Commercial',
    contractValue: 45000000,
    renewalDate: new Date(2025, 2, 31),
    currentRates: {
      inpatientDRG: 0.82,
      outpatientAPC: 0.78,
      professionalRVU: 0.85
    },
    benchmarkRates: {
      inpatientDRG: 0.95,
      outpatientAPC: 0.88,
      professionalRVU: 0.92
    },
    negotiationOpportunity: 12.5,
    riskFactors: [
      'High utilization in oncology services',
      'Above-average length of stay',
      'Increasing emergency department volumes'
    ],
    leveragePoints: [
      'Excellent patient satisfaction scores (95th percentile)',
      'Low readmission rates for cardiac procedures',
      'Strong quality metrics in surgical services',
      'Market leader in specialized care'
    ],
    aiInsights: [
      'Historical data shows 8-10% rate increases achievable',
      'Quality bonuses can offset utilization concerns',
      'Similar contracts in region averaging 15% higher rates'
    ],
    priority: 'High'
  },
  {
    id: '2',
    payerName: 'Cigna Health Plan',
    contractValue: 28000000,
    renewalDate: new Date(2025, 8, 15),
    currentRates: {
      inpatientDRG: 0.88,
      outpatientAPC: 0.85,
      professionalRVU: 0.89
    },
    benchmarkRates: {
      inpatientDRG: 0.92,
      outpatientAPC: 0.90,
      professionalRVU: 0.94
    },
    negotiationOpportunity: 6.8,
    riskFactors: [
      'Declining patient volumes',
      'Competitive market pressures'
    ],
    leveragePoints: [
      'Exclusive provider for certain specialties',
      'Strong preventive care programs',
      'Low cost per case in medical services'
    ],
    aiInsights: [
      'Focus on value-based arrangements',
      'Leverage preventive care ROI data',
      'Propose bundled payment pilots'
    ],
    priority: 'Medium'
  }
];

const mockDenialPredictions: DenialPrediction[] = [
  {
    id: '1',
    claimId: 'CLM-2024-087432',
    patientId: 'P-45892',
    serviceDate: new Date(2024, 8, 20),
    payerName: 'Medicare',
    claimAmount: 25600,
    drgCode: '470',
    denialRiskScore: 85,
    riskFactors: [
      { factor: 'Missing prior authorization', weight: 0.4, impact: 'High' },
      { factor: 'Incomplete documentation', weight: 0.3, impact: 'High' },
      { factor: 'Coding inconsistency', weight: 0.15, impact: 'Medium' }
    ],
    recommendations: [
      'Obtain retroactive prior authorization immediately',
      'Submit additional clinical documentation',
      'Review and correct DRG coding',
      'Flag for pre-submission review'
    ],
    preventionActions: [
      'Implement automated prior auth checking',
      'Enhance clinical documentation templates',
      'Provide coding education for this DRG'
    ],
    status: 'Under Review'
  },
  {
    id: '2',
    claimId: 'CLM-2024-087855',
    patientId: 'P-46234',
    serviceDate: new Date(2024, 8, 22),
    payerName: 'Aetna',
    claimAmount: 18900,
    drgCode: '292',
    denialRiskScore: 65,
    riskFactors: [
      { factor: 'Medical necessity question', weight: 0.5, impact: 'High' },
      { factor: 'Length of stay variance', weight: 0.3, impact: 'Medium' }
    ],
    recommendations: [
      'Provide peer-to-peer review',
      'Submit additional clinical rationale',
      'Document medical complexity factors'
    ],
    preventionActions: [
      'Develop medical necessity templates',
      'Implement utilization review protocols'
    ],
    status: 'Submitted'
  }
];

const mockCostPerEpisode: CostPerEpisode[] = [
  {
    id: '1',
    drgCode: '470',
    drgDescription: 'Major Hip and Knee Joint Replacement',
    episodeCount: 245,
    averageCost: 18500,
    averageReimbursement: 22100,
    margin: 3600,
    marginPercentage: 16.3,
    qualityMetrics: {
      readmissionRate: 2.8,
      complicationRate: 1.2,
      lengthOfStay: 2.4,
      patientSatisfaction: 92
    },
    benchmark: {
      nationalAverage: 19200,
      peerAverage: 18800,
      topPerformer: 17200
    },
    improvementOpportunity: 1300,
    aiOptimizations: [
      'Reduce implant costs through better contracting',
      'Optimize surgical scheduling to reduce OR time',
      'Enhance recovery protocols to reduce LOS',
      'Implement same-day discharge for appropriate patients'
    ]
  },
  {
    id: '2',
    drgCode: '292',
    drgDescription: 'Heart Failure and Shock with CC',
    episodeCount: 180,
    averageCost: 12800,
    averageReimbursement: 11200,
    margin: -1600,
    marginPercentage: -12.5,
    qualityMetrics: {
      readmissionRate: 18.5,
      complicationRate: 8.3,
      lengthOfStay: 4.2,
      patientSatisfaction: 87
    },
    benchmark: {
      nationalAverage: 11500,
      peerAverage: 11800,
      topPerformer: 10200
    },
    improvementOpportunity: 2600,
    aiOptimizations: [
      'Critical: Reduce readmission rate through better discharge planning',
      'Implement heart failure pathway to reduce LOS',
      'Enhance care coordination with cardiology',
      'Focus on medication reconciliation and patient education'
    ]
  }
];

const mockFinancialMetrics: FinancialMetrics = {
  totalRevenue: 125000000,
  netRevenue: 98500000,
  operatingMargin: 8.2,
  denialRate: 3.8,
  daysInAR: 42,
  contractedAdjustments: 15200000,
  valueBasedRevenue: 28500000,
  feeForServiceRevenue: 70000000,
  averageReimbursement: 8950,
  costPerCase: 8230,
  qualityBonuses: 2100000,
  penaltyCharges: 450000,
  monthlyROI: 1850000
};

interface FinancialPerformanceProps {
  className?: string;
}

export function FinancialPerformance({ className }: FinancialPerformanceProps) {
  const { showAlert } = useAlert();
  const { showSuccess, showInfo, showWarning, showError } = useToast();
  const { scheduleTimeout } = useTimeoutManager();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'value_based' | 'payer_negotiations' | 'denial_management' | 'cost_per_episode' | 'analytics'>('overview');
  const [valueBasedContracts] = useState<ValueBasedContract[]>(mockValueBasedContracts);
  const [payerNegotiations] = useState<PayerNegotiation[]>(mockPayerNegotiations);
  const [denialPredictions, setDenialPredictions] = useState<DenialPrediction[]>(mockDenialPredictions);
  const [costPerEpisode] = useState<CostPerEpisode[]>(mockCostPerEpisode);
  const [metrics] = useState<FinancialMetrics>(mockFinancialMetrics);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    showInfo('Refreshing', 'Updating AI financial analytics and revenue optimization insights...');
    
    scheduleTimeout(() => {
      setIsRefreshing(false);
      showSuccess('Data Updated', 'Financial performance intelligence refreshed with latest AI predictions');
    }, 2000);
  };

  const handleOptimizeRevenue = () => {
    showAlert({
      type: 'info',
      title: 'AI Revenue Optimization',
      message: 'Implementing AI recommendations:\n\n• Optimize 3 underperforming value-based contracts\n• Negotiate 2 high-priority payer renewals\n• Prevent 15 high-risk claim denials\n• Reduce costs for 5 loss-making DRGs\n\nExpected improvement: $1.85M monthly revenue increase'
    });
  };

  const handlePreventDenial = (denialId: string) => {
    setDenialPredictions(prev => prev.map(denial => 
      denial.id === denialId ? { ...denial, denialRiskScore: denial.denialRiskScore - 30 } : denial
    ));
    showSuccess('Prevention Actions Applied', 'Claim risk score reduced through AI recommendations');
  };

  const getContractStatusColor = (status: string) => {
    switch (status) {
      case 'Performing': return 'text-green-600 bg-green-50 border-green-200';
      case 'At Risk': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Underperforming': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const atRiskContracts = valueBasedContracts.filter(c => c.status === 'At Risk' || c.status === 'Underperforming');
  const highRiskDenials = denialPredictions.filter(d => d.denialRiskScore >= 70);
  const lossLeaders = costPerEpisode.filter(c => c.marginPercentage < 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DollarSign className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Performance & Revenue Optimization</h1>
            <p className="text-sm text-gray-500">AI-Powered Value-Based Care & RCM Analytics</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="info"
            onClick={handleOptimizeRevenue}
            className="flex items-center space-x-2"
          >
            <Brain className="h-4 w-4" />
            <span>AI Optimize Revenue</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Monthly ROI</p>
                <p className="text-2xl font-bold text-green-700">
                  ${(metrics.monthlyROI / 1000000).toFixed(2)}M
                </p>
                <p className="text-xs text-green-500">{metrics.operatingMargin}% operating margin</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={atRiskContracts.length > 0 ? "border-red-200 bg-red-50" : "border-blue-200 bg-blue-50"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${atRiskContracts.length > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  VBC Performance
                </p>
                <p className={`text-2xl font-bold ${atRiskContracts.length > 0 ? 'text-red-700' : 'text-blue-700'}`}>
                  {atRiskContracts.length}
                </p>
                <p className={`text-xs ${atRiskContracts.length > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  contracts at risk
                </p>
              </div>
              <Target className={`h-8 w-8 ${atRiskContracts.length > 0 ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={metrics.denialRate > 5 ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${metrics.denialRate > 5 ? 'text-orange-600' : 'text-green-600'}`}>
                  Denial Rate
                </p>
                <p className={`text-2xl font-bold ${metrics.denialRate > 5 ? 'text-orange-700' : 'text-green-700'}`}>
                  {metrics.denialRate}%
                </p>
                <p className={`text-xs ${metrics.denialRate > 5 ? 'text-orange-500' : 'text-green-500'}`}>
                  {highRiskDenials.length} high-risk claims
                </p>
              </div>
              <Shield className={`h-8 w-8 ${metrics.denialRate > 5 ? 'text-orange-600' : 'text-green-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={lossLeaders.length > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${lossLeaders.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  Loss Leaders
                </p>
                <p className={`text-2xl font-bold ${lossLeaders.length > 0 ? 'text-red-700' : 'text-green-700'}`}>
                  {lossLeaders.length}
                </p>
                <p className={`text-xs ${lossLeaders.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  DRGs with negative margin
                </p>
              </div>
              <Calculator className={`h-8 w-8 ${lossLeaders.length > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'value_based', label: 'Value-Based Care', icon: Target },
            { id: 'payer_negotiations', label: 'Payer Negotiations', icon: Briefcase },
            { id: 'denial_management', label: 'Denial Management', icon: Shield },
            { id: 'cost_per_episode', label: 'Cost Per Episode', icon: Calculator },
            { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3 }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as 'overview' | 'value_based' | 'payer_negotiations' | 'denial_management' | 'cost_per_episode' | 'analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Revenue Performance</span>
              </CardTitle>
              <CardDescription>
                Key financial metrics and value-based care performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">
                    ${(metrics.netRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-green-700">Net Revenue</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">
                    ${(metrics.valueBasedRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-blue-700">Value-Based</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    ${(metrics.qualityBonuses / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-purple-700">Quality Bonuses</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">{metrics.daysInAR}</div>
                  <div className="text-sm text-orange-700">Days in A/R</div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">AI Revenue Opportunities</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Contract Rate Optimization:</span>
                    <span className="font-medium text-green-600">+$425K/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Denial Prevention:</span>
                    <span className="font-medium text-green-600">+$380K/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DRG Cost Optimization:</span>
                    <span className="font-medium text-green-600">+$520K/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Value-Based Bonuses:</span>
                    <span className="font-medium text-green-600">+$525K/month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* At-Risk Contracts & Claims */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Critical Risk Areas</span>
              </CardTitle>
              <CardDescription>
                Contracts and claims requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* At-Risk Value-Based Contracts */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">At-Risk VBC Contracts</h4>
                {atRiskContracts.slice(0, 2).map(contract => (
                  <div key={contract.id} className={`border rounded-lg p-3 mb-2 ${getContractStatusColor(contract.status)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-semibold">{contract.payerName}</h5>
                        <p className="text-sm">{contract.contractType} • {contract.totalLives.toLocaleString()} lives</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">
                          ${Math.abs(contract.currentPerformance.penaltyRisk / 1000)}K
                        </div>
                        <div className="text-xs">At Risk</div>
                      </div>
                    </div>
                    <div className="text-xs">
                      <strong>Quality Score:</strong> {contract.currentPerformance.qualityScore}% 
                      (Target: {contract.targets.qualityThreshold}%)
                    </div>
                  </div>
                ))}
              </div>

              {/* High-Risk Claims */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">High-Risk Claims</h4>
                {highRiskDenials.slice(0, 2).map(claim => (
                  <div key={claim.id} className="border border-red-200 bg-red-50 rounded-lg p-3 mb-2">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-semibold">{claim.claimId}</h5>
                        <p className="text-sm">{claim.payerName} • DRG {claim.drgCode}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{claim.denialRiskScore}%</div>
                        <div className="text-xs">Risk Score</div>
                      </div>
                    </div>
                    <div className="text-xs mb-2">
                      <strong>Amount:</strong> ${claim.claimAmount.toLocaleString()}
                    </div>
                    <div className="text-xs">
                      <strong>Top Risk:</strong> {claim.riskFactors[0]?.factor}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'value_based' && (
        <div className="space-y-6">
          {/* Value-Based Care Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{valueBasedContracts.length}</div>
                <div className="text-sm text-gray-600">VBC Contracts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {(valueBasedContracts.reduce((sum, c) => sum + c.totalLives, 0) / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Lives Covered</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  ${(valueBasedContracts.reduce((sum, c) => sum + c.currentPerformance.savingsGenerated, 0) / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Savings Generated</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  ${(valueBasedContracts.reduce((sum, c) => sum + c.currentPerformance.bonusPayments, 0) / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Quality Bonuses</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Contract Performance */}
          <div className="space-y-4">
            {valueBasedContracts.map(contract => (
              <Card key={contract.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{contract.payerName}</h3>
                      <p className="text-sm text-gray-600">{contract.contractType} • {contract.totalLives.toLocaleString()} Lives</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getContractStatusColor(contract.status)}`}>
                      {contract.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Performance Metrics */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Current Performance</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Quality Score:</span>
                          <span className={`font-medium ${contract.currentPerformance.qualityScore >= contract.targets.qualityThreshold ? 'text-green-600' : 'text-red-600'}`}>
                            {contract.currentPerformance.qualityScore}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost Per Member:</span>
                          <span className={`font-medium ${contract.currentPerformance.costPerMember <= contract.targets.costTarget ? 'text-green-600' : 'text-red-600'}`}>
                            ${contract.currentPerformance.costPerMember}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Savings Generated:</span>
                          <span className={`font-medium ${contract.currentPerformance.savingsGenerated >= contract.targets.savingsTarget ? 'text-green-600' : 'text-red-600'}`}>
                            ${(contract.currentPerformance.savingsGenerated / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bonus Payments:</span>
                          <span className="font-medium text-green-600">
                            ${(contract.currentPerformance.bonusPayments / 1000).toFixed(0)}K
                          </span>
                        </div>
                        {contract.currentPerformance.penaltyRisk > 0 && (
                          <div className="flex justify-between">
                            <span>Penalty Risk:</span>
                            <span className="font-medium text-red-600">
                              ${(contract.currentPerformance.penaltyRisk / 1000).toFixed(0)}K
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Targets */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Contract Targets</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Quality Threshold:</span>
                          <span className="font-medium">{contract.targets.qualityThreshold}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost Target:</span>
                          <span className="font-medium">${contract.targets.costTarget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Savings Target:</span>
                          <span className="font-medium">${(contract.targets.savingsTarget / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-sm font-medium">Risk Level:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          contract.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                          contract.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {contract.riskLevel}
                        </span>
                      </div>
                    </div>

                    {/* AI Recommendations */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">AI Recommendations</h4>
                      <div className="space-y-2">
                        {contract.aiRecommendations.map((recommendation, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other tabs would continue similarly... */}
      
      {selectedTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Financial Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{metrics.operatingMargin}%</div>
                    <div className="text-sm text-blue-700">Operating Margin</div>
                    <div className="text-xs text-blue-500">Above industry avg</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${(metrics.averageReimbursement / 1000).toFixed(1)}K
                    </div>
                    <div className="text-sm text-green-700">Avg Reimbursement</div>
                    <div className="text-xs text-green-500">Per case</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{metrics.denialRate}%</div>
                    <div className="text-sm text-purple-700">Denial Rate</div>
                    <div className="text-xs text-purple-500">Below benchmark</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{metrics.daysInAR}</div>
                    <div className="text-sm text-orange-700">Days in A/R</div>
                    <div className="text-xs text-orange-500">Target: &lt;40 days</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>ROI Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">AI Financial Optimization:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Contract Rate Optimization:</span>
                      <span className="font-medium text-green-600">+$425K/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Denial Prevention & Recovery:</span>
                      <span className="font-medium text-green-600">+$380K/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost-per-Episode Reduction:</span>
                      <span className="font-medium text-green-600">+$520K/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Value-Based Care Bonuses:</span>
                      <span className="font-medium text-green-600">+$525K/month</span>
                    </div>
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">$1.85M</div>
                  <div className="text-sm text-green-700">Total Monthly Benefits</div>
                  <div className="text-xs text-green-500">$22.2M annualized ROI</div>
                </div>
                <div className="text-center text-xs text-gray-600">
                  <p>Addressing $4.1B market opportunity by 2027</p>
                  <p>AI-powered revenue optimization and value-based care analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payer Negotiations Tab */}
      {selectedTab === 'payer_negotiations' && (
        <div className="space-y-6">
          {/* Payer Negotiations Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Active Negotiations</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
                  <p className="text-sm text-gray-500">In progress</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Rate Increase</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">8.5%</p>
                  <p className="text-sm text-gray-500">Average achieved</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Contract Value</h3>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">$2.4M</p>
                  <p className="text-sm text-gray-500">Annual impact</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Negotiations Status Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Negotiations Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-3">Payer</th>
                      <th className="text-left p-3">Service Line</th>
                      <th className="text-left p-3">Current Rate</th>
                      <th className="text-left p-3">Target Rate</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3 font-medium">Aetna</td>
                      <td className="p-3">Cardiology</td>
                      <td className="p-3">$485</td>
                      <td className="p-3">$525</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">In Progress</span>
                      </td>
                      <td className="p-3">Dec 15, 2024</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Blue Cross</td>
                      <td className="p-3">Emergency</td>
                      <td className="p-3">$650</td>
                      <td className="p-3">$710</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Approved</span>
                      </td>
                      <td className="p-3">Jan 30, 2025</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Medicare</td>
                      <td className="p-3">Surgery</td>
                      <td className="p-3">$1,200</td>
                      <td className="p-3">$1,350</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Declined</span>
                      </td>
                      <td className="p-3">Nov 20, 2024</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Cigna</td>
                      <td className="p-3">Radiology</td>
                      <td className="p-3">$320</td>
                      <td className="p-3">$365</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Under Review</span>
                      </td>
                      <td className="p-3">Feb 14, 2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Denial Management Tab */}
      {selectedTab === 'denial_management' && (
        <div className="space-y-6">
          {/* Denial Management Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Denial Rate</h3>
                  <p className="text-3xl font-bold text-red-600 mt-2">6.8%</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Pending Appeals</h3>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">45</p>
                  <p className="text-sm text-gray-500">In review</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Recovery Rate</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">78%</p>
                  <p className="text-sm text-gray-500">Success rate</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Recovered Amount</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">$1.2M</p>
                  <p className="text-sm text-gray-500">This quarter</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Denials */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Denials & Appeals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-3">Claim ID</th>
                      <th className="text-left p-3">Payer</th>
                      <th className="text-left p-3">Service</th>
                      <th className="text-left p-3">Amount</th>
                      <th className="text-left p-3">Reason</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3 font-mono">CL-2024-8901</td>
                      <td className="p-3">Aetna</td>
                      <td className="p-3">MRI Scan</td>
                      <td className="p-3">$2,450</td>
                      <td className="p-3">Pre-auth required</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Appealing</span>
                      </td>
                      <td className="p-3">
                        <button className="text-blue-600 hover:underline text-xs">View Details</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">CL-2024-8902</td>
                      <td className="p-3">Blue Cross</td>
                      <td className="p-3">Surgery</td>
                      <td className="p-3">$12,800</td>
                      <td className="p-3">Medical necessity</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Overturned</span>
                      </td>
                      <td className="p-3">
                        <button className="text-blue-600 hover:underline text-xs">View Details</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">CL-2024-8903</td>
                      <td className="p-3">Medicare</td>
                      <td className="p-3">Physical Therapy</td>
                      <td className="p-3">$890</td>
                      <td className="p-3">Frequency limits</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Upheld</span>
                      </td>
                      <td className="p-3">
                        <button className="text-blue-600 hover:underline text-xs">View Details</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cost Per Episode Tab */}
      {selectedTab === 'cost_per_episode' && (
        <div className="space-y-6">
          {/* Cost Per Episode Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Avg Episode Cost</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">$8,450</p>
                  <p className="text-sm text-gray-500">All services</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Cost Reduction</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">12.3%</p>
                  <p className="text-sm text-gray-500">YoY improvement</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Benchmark vs Actual</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">-5.2%</p>
                  <p className="text-sm text-gray-500">Below benchmark</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Episodes This Month</h3>
                  <p className="text-3xl font-bold text-orange-600 mt-2">1,284</p>
                  <p className="text-sm text-gray-500">Total completed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost by Service Line */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Per Episode by Service Line</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-3">Service Line</th>
                      <th className="text-left p-3">Avg Cost</th>
                      <th className="text-left p-3">Benchmark</th>
                      <th className="text-left p-3">Variance</th>
                      <th className="text-left p-3">Episodes</th>
                      <th className="text-left p-3">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3 font-medium">Cardiology</td>
                      <td className="p-3">$12,450</td>
                      <td className="p-3">$13,200</td>
                      <td className="p-3 text-green-600">-5.7%</td>
                      <td className="p-3">245</td>
                      <td className="p-3">
                        <span className="text-green-600">↓</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Orthopedics</td>
                      <td className="p-3">$15,680</td>
                      <td className="p-3">$14,900</td>
                      <td className="p-3 text-red-600">+5.2%</td>
                      <td className="p-3">189</td>
                      <td className="p-3">
                        <span className="text-red-600">↑</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Emergency</td>
                      <td className="p-3">$3,890</td>
                      <td className="p-3">$4,100</td>
                      <td className="p-3 text-green-600">-5.1%</td>
                      <td className="p-3">456</td>
                      <td className="p-3">
                        <span className="text-green-600">↓</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Surgery</td>
                      <td className="p-3">$18,250</td>
                      <td className="p-3">$17,800</td>
                      <td className="p-3 text-red-600">+2.5%</td>
                      <td className="p-3">123</td>
                      <td className="p-3">
                        <span className="text-red-600">↑</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Radiology</td>
                      <td className="p-3">$1,280</td>
                      <td className="p-3">$1,350</td>
                      <td className="p-3 text-green-600">-5.2%</td>
                      <td className="p-3">271</td>
                      <td className="p-3">
                        <span className="text-green-600">↓</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Cost Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Episode Cost Trends</CardTitle>
              <div className="text-sm text-gray-500">Monthly average cost per episode by service line</div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <div className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', Cardiology: 12800, Orthopedics: 15200, Emergency: 4100, Surgery: 18900, Radiology: 1400 },
                        { month: 'Feb', Cardiology: 12600, Orthopedics: 15400, Emergency: 4000, Surgery: 18600, Radiology: 1350 },
                        { month: 'Mar', Cardiology: 12700, Orthopedics: 15600, Emergency: 3950, Surgery: 18400, Radiology: 1320 },
                        { month: 'Apr', Cardiology: 12500, Orthopedics: 15500, Emergency: 3900, Surgery: 18300, Radiology: 1300 },
                        { month: 'May', Cardiology: 12450, Orthopedics: 15680, Emergency: 3890, Surgery: 18250, Radiology: 1280 },
                        { month: 'Jun', Cardiology: 12400, Orthopedics: 15750, Emergency: 3850, Surgery: 18200, Radiology: 1260 }
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                        labelFormatter={(label: string) => `Month: ${label}`}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Cardiology"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Orthopedics"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Emergency"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Surgery"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Radiology"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Trend Insights */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Positive Trends</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Cardiology costs down 3.1% over 6 months</li>
                    <li>• Emergency department efficiency improving</li>
                    <li>• Radiology costs reduced by 10% through automation</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Areas for Attention</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Orthopedics showing 3.6% cost increase</li>
                    <li>• Surgery department needs efficiency review</li>
                    <li>• Consider value-based care contracts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
