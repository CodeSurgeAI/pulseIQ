'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TruckIcon, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Brain,
  Shield,
  Target,
  Zap,
  Activity,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Plus,
  DollarSign,
  Warehouse,
  Factory,
  ShoppingCart,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  MapPin,
  Truck,
  AlertCircle,
  CheckCircle2,
  Timer,
  Boxes,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';

// Types for Supply Chain Intelligence
export interface InventoryItem {
  id: string;
  name: string;
  category: 'Medical Supplies' | 'Pharmaceuticals' | 'Equipment' | 'PPE' | 'Laboratory' | 'Consumables';
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  safetyStock: number;
  unit: string;
  costPerUnit: number;
  totalValue: number;
  lastRestocked: Date;
  averageDailyUsage: number;
  predictedUsage: number;
  daysOfSupply: number;
  stockoutRisk: 'low' | 'medium' | 'high' | 'critical';
  demandTrend: 'increasing' | 'stable' | 'decreasing';
  seasonalityFactor: number;
  leadTimeOptimal: number; // days
  leadTimeCurrent: number; // days
  primaryVendor: string;
  alternativeVendors: string[];
  criticalityLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface Vendor {
  id: string;
  name: string;
  type: 'Primary' | 'Secondary' | 'Emergency';
  riskScore: number; // 0-100
  reliabilityScore: number; // 0-100
  costScore: number; // 0-100 (higher is better value)
  qualityScore: number; // 0-100
  location: string;
  categories: string[];
  activeContracts: number;
  totalSpend: number;
  onTimeDelivery: number;
  defectRate: number;
  leadTime: number;
  paymentTerms: string;
  certifications: string[];
  riskFactors: string[];
  lastAssessment: Date;
  suppliesProvided: string[];
  contingencyLevel: 'none' | 'low' | 'medium' | 'high';
}

export interface StockoutAlert {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'approaching_reorder' | 'below_safety_stock' | 'stockout_imminent' | 'completely_depleted';
  currentStock: number;
  daysRemaining: number;
  predictedStockoutDate: Date;
  impact: string;
  recommendations: string[];
  estimatedCost: number;
  affectedDepartments: string[];
  timestamp: Date;
  acknowledged: boolean;
}

export interface SupplyChainMetrics {
  totalInventoryValue: number;
  stockoutRisk: number;
  vendorDiversification: number;
  avgLeadTime: number;
  onTimeDelivery: number;
  costSavingsOpportunity: number;
  automatedOrders: number;
  criticalStockouts: number;
  vendorRiskScore: number;
  demandForecastAccuracy: number;
}

export interface ReorderRecommendation {
  id: string;
  itemId: string;
  itemName: string;
  recommendedQuantity: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
  costImpact: number;
  expectedDelivery: Date;
  vendorRecommendation: string;
  alternativeOptions: {
    vendor: string;
    quantity: number;
    cost: number;
    deliveryDate: Date;
    qualityScore: number;
  }[];
  riskMitigation: string[];
  confidence: number;
}

// Mock Data
const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'N95 Respirator Masks',
    category: 'PPE',
    currentStock: 150,
    reorderPoint: 500,
    maxStock: 2000,
    safetyStock: 300,
    unit: 'boxes',
    costPerUnit: 45.50,
    totalValue: 6825,
    lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    averageDailyUsage: 35,
    predictedUsage: 42,
    daysOfSupply: 4,
    stockoutRisk: 'critical',
    demandTrend: 'increasing',
    seasonalityFactor: 1.2,
    leadTimeOptimal: 7,
    leadTimeCurrent: 14,
    primaryVendor: 'MedSupply Solutions',
    alternativeVendors: ['Healthcare Direct', 'Safety First Supply'],
    criticalityLevel: 'critical'
  },
  {
    id: '2',
    name: 'Surgical Gloves (Nitrile)',
    category: 'PPE',
    currentStock: 2400,
    reorderPoint: 1000,
    maxStock: 5000,
    safetyStock: 800,
    unit: 'boxes',
    costPerUnit: 12.75,
    totalValue: 30600,
    lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    averageDailyUsage: 180,
    predictedUsage: 195,
    daysOfSupply: 13,
    stockoutRisk: 'medium',
    demandTrend: 'stable',
    seasonalityFactor: 1.0,
    leadTimeOptimal: 5,
    leadTimeCurrent: 7,
    primaryVendor: 'Global Medical Supplies',
    alternativeVendors: ['MedPro Distributors', 'Elite Healthcare'],
    criticalityLevel: 'high'
  },
  {
    id: '3',
    name: 'IV Catheters (20G)',
    category: 'Medical Supplies',
    currentStock: 800,
    reorderPoint: 300,
    maxStock: 1500,
    safetyStock: 200,
    unit: 'units',
    costPerUnit: 3.25,
    totalValue: 2600,
    lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    averageDailyUsage: 45,
    predictedUsage: 38,
    daysOfSupply: 18,
    stockoutRisk: 'low',
    demandTrend: 'decreasing',
    seasonalityFactor: 0.95,
    leadTimeOptimal: 3,
    leadTimeCurrent: 5,
    primaryVendor: 'Advanced Medical Devices',
    alternativeVendors: ['Precision Healthcare', 'MedTech Solutions'],
    criticalityLevel: 'high'
  },
  {
    id: '4',
    name: 'Propofol 10mg/ml',
    category: 'Pharmaceuticals',
    currentStock: 45,
    reorderPoint: 100,
    maxStock: 300,
    safetyStock: 75,
    unit: 'vials',
    costPerUnit: 24.80,
    totalValue: 1116,
    lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    averageDailyUsage: 8,
    predictedUsage: 12,
    daysOfSupply: 4,
    stockoutRisk: 'critical',
    demandTrend: 'increasing',
    seasonalityFactor: 1.1,
    leadTimeOptimal: 2,
    leadTimeCurrent: 10,
    primaryVendor: 'PharmaCorp International',
    alternativeVendors: ['MedPharm Distributors', 'Global Pharma Supply'],
    criticalityLevel: 'critical'
  }
];

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'MedSupply Solutions',
    type: 'Primary',
    riskScore: 75,
    reliabilityScore: 88,
    costScore: 82,
    qualityScore: 94,
    location: 'Chicago, IL',
    categories: ['PPE', 'Medical Supplies'],
    activeContracts: 12,
    totalSpend: 450000,
    onTimeDelivery: 88,
    defectRate: 2.1,
    leadTime: 14,
    paymentTerms: 'Net 30',
    certifications: ['ISO 13485', 'FDA Registered'],
    riskFactors: ['Extended lead times', 'Single source dependency'],
    lastAssessment: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    suppliesProvided: ['N95 Respirator Masks', 'Face Shields', 'Isolation Gowns'],
    contingencyLevel: 'medium'
  },
  {
    id: '2',
    name: 'Global Medical Supplies',
    type: 'Primary',
    riskScore: 45,
    reliabilityScore: 95,
    costScore: 91,
    qualityScore: 96,
    location: 'Dallas, TX',
    categories: ['PPE', 'Medical Supplies', 'Equipment'],
    activeContracts: 18,
    totalSpend: 680000,
    onTimeDelivery: 95,
    defectRate: 0.8,
    leadTime: 7,
    paymentTerms: 'Net 45',
    certifications: ['ISO 13485', 'FDA Registered', 'CE Marked'],
    riskFactors: ['Weather-related delays'],
    lastAssessment: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    suppliesProvided: ['Surgical Gloves', 'Syringes', 'Wound Dressings'],
    contingencyLevel: 'low'
  },
  {
    id: '3',
    name: 'PharmaCorp International',
    type: 'Primary',
    riskScore: 85,
    reliabilityScore: 78,
    costScore: 65,
    qualityScore: 98,
    location: 'New Jersey, NJ',
    categories: ['Pharmaceuticals'],
    activeContracts: 8,
    totalSpend: 920000,
    onTimeDelivery: 78,
    defectRate: 0.2,
    leadTime: 10,
    paymentTerms: 'Net 60',
    certifications: ['FDA Approved', 'GMP Certified', 'DEA Licensed'],
    riskFactors: ['Regulatory delays', 'Manufacturing capacity constraints'],
    lastAssessment: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    suppliesProvided: ['Propofol', 'Morphine', 'Antibiotics'],
    contingencyLevel: 'high'
  }
];

const mockStockoutAlerts: StockoutAlert[] = [
  {
    id: '1',
    itemId: '1',
    itemName: 'N95 Respirator Masks',
    category: 'PPE',
    severity: 'critical',
    type: 'stockout_imminent',
    currentStock: 150,
    daysRemaining: 4,
    predictedStockoutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
    impact: 'Critical patient safety risk - unable to protect healthcare workers',
    recommendations: [
      'Emergency order from alternative vendor',
      'Implement conservation protocols immediately',
      'Activate backup supplier contracts',
      'Consider temporary substitutes with approval'
    ],
    estimatedCost: 125000,
    affectedDepartments: ['ICU', 'Emergency', 'Surgery', 'All Patient Care Areas'],
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    acknowledged: false
  },
  {
    id: '2',
    itemId: '4',
    itemName: 'Propofol 10mg/ml',
    category: 'Pharmaceuticals',
    severity: 'critical',
    type: 'below_safety_stock',
    currentStock: 45,
    daysRemaining: 4,
    predictedStockoutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
    impact: 'Surgical procedures may need to be postponed',
    recommendations: [
      'Expedite delivery from primary vendor',
      'Contact alternative pharmaceutical suppliers',
      'Prioritize critical surgeries',
      'Consider alternative anesthetic protocols'
    ],
    estimatedCost: 75000,
    affectedDepartments: ['Surgery', 'ICU', 'Emergency'],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    acknowledged: true
  }
];

const mockReorderRecommendations: ReorderRecommendation[] = [
  {
    id: '1',
    itemId: '1',
    itemName: 'N95 Respirator Masks',
    recommendedQuantity: 1500,
    urgency: 'critical',
    reasoning: 'Current stock critically low (4 days supply). Increased demand pattern detected. Lead time extended to 14 days.',
    costImpact: 68250,
    expectedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    vendorRecommendation: 'Healthcare Direct (Emergency Supplier)',
    alternativeOptions: [
      {
        vendor: 'MedSupply Solutions',
        quantity: 1500,
        cost: 68250,
        deliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        qualityScore: 94
      },
      {
        vendor: 'Safety First Supply',
        quantity: 1500,
        cost: 72000,
        deliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        qualityScore: 91
      }
    ],
    riskMitigation: [
      'Expedited shipping available',
      'Quality pre-verified',
      'Emergency stock protocol activated'
    ],
    confidence: 96
  },
  {
    id: '2',
    itemId: '4',
    itemName: 'Propofol 10mg/ml',
    recommendedQuantity: 200,
    urgency: 'critical',
    reasoning: 'Below safety stock level. Critical for surgical operations. Extended lead time from primary vendor.',
    costImpact: 4960,
    expectedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    vendorRecommendation: 'PharmaCorp International',
    alternativeOptions: [
      {
        vendor: 'Global Pharma Supply',
        quantity: 200,
        cost: 5200,
        deliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        qualityScore: 95
      }
    ],
    riskMitigation: [
      'DEA compliance verified',
      'Temperature-controlled shipping',
      'Batch testing protocols'
    ],
    confidence: 92
  }
];

const mockSupplyChainMetrics: SupplyChainMetrics = {
  totalInventoryValue: 2450000,
  stockoutRisk: 23,
  vendorDiversification: 78,
  avgLeadTime: 8.5,
  onTimeDelivery: 87,
  costSavingsOpportunity: 145000,
  automatedOrders: 67,
  criticalStockouts: 2,
  vendorRiskScore: 68,
  demandForecastAccuracy: 89
};

interface SupplyChainIntelligenceProps {
  className?: string;
}

export function SupplyChainIntelligence({ className }: SupplyChainIntelligenceProps) {
  const { showAlert } = useAlert();
  const { showSuccess, showInfo, showWarning, showError } = useToast();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'inventory' | 'vendors' | 'reorder' | 'analytics'>('overview');
  const [inventoryItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [vendors] = useState<Vendor[]>(mockVendors);
  const [stockoutAlerts, setStockoutAlerts] = useState<StockoutAlert[]>(mockStockoutAlerts);
  const [reorderRecommendations] = useState<ReorderRecommendation[]>(mockReorderRecommendations);
  const [metrics] = useState<SupplyChainMetrics>(mockSupplyChainMetrics);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    showInfo('Refreshing', 'Updating AI supply chain predictions and inventory analytics...');
    
    setTimeout(() => {
      setIsRefreshing(false);
      showSuccess('Data Updated', 'Supply chain intelligence refreshed with latest AI predictions');
    }, 2000);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setStockoutAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    showSuccess('Alert Acknowledged', 'Stockout alert has been reviewed and acknowledged');
  };

  const handleImplementReorder = (recommendationId: string) => {
    const recommendation = reorderRecommendations.find(r => r.id === recommendationId);
    if (recommendation) {
      showAlert({
        type: 'info',
        title: 'Implementing Reorder Recommendation',
        message: `Placing order for ${recommendation.itemName}:\n\nQuantity: ${recommendation.recommendedQuantity} ${inventoryItems.find(i => i.id === recommendation.itemId)?.unit || 'units'}\nVendor: ${recommendation.vendorRecommendation}\nEstimated Cost: $${recommendation.costImpact.toLocaleString()}\nExpected Delivery: ${recommendation.expectedDelivery.toLocaleDateString()}\n\nConfidence: ${recommendation.confidence}%`
      });
    }
  };

  const getStockoutRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getVendorRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const criticalAlerts = stockoutAlerts.filter(a => a.severity === 'critical' && !a.acknowledged);
  const criticalItems = inventoryItems.filter(i => i.stockoutRisk === 'critical');
  const highRiskVendors = vendors.filter(v => v.riskScore >= 70);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Supply Chain Intelligence</h1>
            <p className="text-sm text-gray-500">AI-Powered Inventory Management & Vendor Risk Assessment</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleRefreshData}
          disabled={isRefreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh AI Predictions</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Critical Stockouts</p>
                <p className="text-2xl font-bold text-red-700">{criticalAlerts.length}</p>
                <p className="text-xs text-red-500">Require immediate action</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">High Risk Vendors</p>
                <p className="text-2xl font-bold text-orange-700">{highRiskVendors.length}</p>
                <p className="text-xs text-orange-500">Need diversification</p>
              </div>
              <TruckIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Cost Savings</p>
                <p className="text-2xl font-bold text-green-700">${Math.round(metrics.costSavingsOpportunity / 1000)}K</p>
                <p className="text-xs text-green-500">Monthly opportunity</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">AI Accuracy</p>
                <p className="text-2xl font-bold text-blue-700">{metrics.demandForecastAccuracy}%</p>
                <p className="text-xs text-blue-500">Demand forecasting</p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'inventory', label: 'Predictive Inventory', icon: Package },
            { id: 'vendors', label: 'Vendor Risk Assessment', icon: TruckIcon },
            { id: 'reorder', label: 'Automated Reordering', icon: ShoppingCart },
            { id: 'analytics', label: 'Supply Chain Analytics', icon: BarChart3 }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as 'overview' | 'inventory' | 'vendors' | 'reorder' | 'analytics')}
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
          {/* Critical Stockout Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Critical Stockout Alerts</span>
              </CardTitle>
              <CardDescription>
                Items requiring immediate attention to prevent patient care disruption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalAlerts.map(alert => (
                <div key={alert.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900">{alert.itemName}</h4>
                      <p className="text-sm text-red-700 mt-1">{alert.impact}</p>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-red-600">Current Stock:</span>
                          <span className="font-medium text-red-800 ml-1">{alert.currentStock}</span>
                        </div>
                        <div>
                          <span className="text-red-600">Days Remaining:</span>
                          <span className="font-medium text-red-800 ml-1">{alert.daysRemaining}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-red-600 mb-1">Immediate Actions:</p>
                        <ul className="text-xs text-red-600 space-y-1">
                          {alert.recommendations.slice(0, 2).map((rec, idx) => (
                            <li key={idx} className="flex items-start space-x-1">
                              <span className="text-red-400 mt-0.5">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      className="ml-3"
                    >
                      Take Action
                    </Button>
                  </div>
                  <div className="text-xs text-red-600">
                    <strong>Estimated Impact:</strong> ${alert.estimatedCost.toLocaleString()} • 
                    <strong> Departments:</strong> {alert.affectedDepartments.join(', ')}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Reorder Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span>AI Reorder Recommendations</span>
              </CardTitle>
              <CardDescription>
                Predictive ordering suggestions based on demand patterns and risk analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reorderRecommendations.slice(0, 2).map(recommendation => (
                <div key={recommendation.id} className={`border rounded-lg p-4 ${
                  recommendation.urgency === 'critical' ? 'border-red-200 bg-red-50' :
                  recommendation.urgency === 'high' ? 'border-orange-200 bg-orange-50' :
                  'border-blue-200 bg-blue-50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{recommendation.itemName}</h4>
                      <p className="text-sm mt-1">{recommendation.reasoning}</p>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        recommendation.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                        recommendation.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {recommendation.urgency.toUpperCase()} Priority
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => handleImplementReorder(recommendation.id)}
                    >
                      Order Now
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-600">Recommended Quantity:</span>
                      <div className="font-medium">{recommendation.recommendedQuantity} units</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Estimated Cost:</span>
                      <div className="font-medium">${recommendation.costImpact.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected Delivery:</span>
                      <div className="font-medium">{recommendation.expectedDelivery.toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">AI Confidence:</span>
                      <div className="font-medium text-green-600">{recommendation.confidence}%</div>
                    </div>
                  </div>
                  
                  <div className="text-xs">
                    <strong>Recommended Vendor:</strong> {recommendation.vendorRecommendation}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'inventory' && (
        <div className="space-y-6">
          {/* Inventory Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Warehouse className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">${Math.round(metrics.totalInventoryValue / 1000)}K</div>
                <div className="text-sm text-gray-600">Total Inventory Value</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Timer className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{metrics.avgLeadTime}</div>
                <div className="text-sm text-gray-600">Avg Lead Time (days)</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{metrics.automatedOrders}%</div>
                <div className="text-sm text-gray-600">Automated Orders</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{metrics.stockoutRisk}%</div>
                <div className="text-sm text-gray-600">Stockout Risk</div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Items */}
          <Card>
            <CardHeader>
              <CardTitle>Predictive Inventory Dashboard</CardTitle>
              <CardDescription>
                Real-time inventory levels with AI-powered demand forecasting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryItems.map(item => (
                  <div key={item.id} className={`border rounded-lg p-4 ${getStockoutRiskColor(item.stockoutRisk)}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStockoutRiskColor(item.stockoutRisk)}`}>
                        {item.stockoutRisk.toUpperCase()} Risk
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Current Stock</p>
                        <p className="font-bold text-lg">{item.currentStock} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Days of Supply</p>
                        <p className="font-bold text-lg">{item.daysOfSupply}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Predicted Usage</p>
                        <p className="font-bold text-lg">{item.predictedUsage}/day</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Lead Time</p>
                        <p className="font-bold text-lg">{item.leadTimeCurrent} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Value</p>
                        <p className="font-bold text-lg">${item.totalValue.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.currentStock <= item.reorderPoint ? 'bg-red-500' :
                          item.currentStock <= item.safetyStock + item.reorderPoint ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Safety: {item.safetyStock}</span>
                      <span>Reorder: {item.reorderPoint}</span>
                      <span>Max: {item.maxStock}</span>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs">
                        <strong>Primary Vendor:</strong> {item.primaryVendor}
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.demandTrend === 'increasing' && (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        )}
                        {item.demandTrend === 'decreasing' && (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-xs font-medium">
                          Trend: {item.demandTrend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'vendors' && (
        <div className="space-y-6">
          {/* Vendor Risk Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Factory className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{vendors.length}</div>
                <div className="text-sm text-gray-600">Active Vendors</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{metrics.vendorRiskScore}</div>
                <div className="text-sm text-gray-600">Avg Risk Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{metrics.onTimeDelivery}%</div>
                <div className="text-sm text-gray-600">On-Time Delivery</div>
              </CardContent>
            </Card>
          </div>

          {/* Vendor Assessment */}
          <div className="space-y-4">
            {vendors.map(vendor => (
              <Card key={vendor.id} className={`border-l-4 ${
                vendor.riskScore >= 80 ? 'border-l-red-500' :
                vendor.riskScore >= 60 ? 'border-l-orange-500' :
                vendor.riskScore >= 40 ? 'border-l-yellow-500' :
                'border-l-green-500'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Factory className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                        <p className="text-sm text-gray-600">{vendor.location} • {vendor.type} Vendor</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-sm font-medium ${getVendorRiskColor(vendor.riskScore)}`}>
                      <div className="text-center">
                        <div className="text-lg font-bold">{vendor.riskScore}</div>
                        <div className="text-xs uppercase">Risk Score</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Performance Metrics */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <span>Performance Metrics</span>
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Reliability Score:</span>
                          <span className="font-medium text-green-600">{vendor.reliabilityScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quality Score:</span>
                          <span className="font-medium text-green-600">{vendor.qualityScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost Score:</span>
                          <span className="font-medium text-blue-600">{vendor.costScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>On-Time Delivery:</span>
                          <span className={vendor.onTimeDelivery >= 90 ? 'font-medium text-green-600' : 'font-medium text-orange-600'}>
                            {vendor.onTimeDelivery}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Defect Rate:</span>
                          <span className={vendor.defectRate <= 2 ? 'font-medium text-green-600' : 'font-medium text-red-600'}>
                            {vendor.defectRate}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contract Details */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span>Contract Details</span>
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Active Contracts:</span>
                          <span className="font-medium">{vendor.activeContracts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Spend:</span>
                          <span className="font-medium">${vendor.totalSpend.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lead Time:</span>
                          <span className="font-medium">{vendor.leadTime} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Terms:</span>
                          <span className="font-medium">{vendor.paymentTerms}</span>
                        </div>
                        <div>
                          <span>Categories:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {vendor.categories.map((cat, idx) => (
                              <span key={idx} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Assessment */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span>Risk Assessment</span>
                      </h4>
                      <div className="space-y-2">
                        {vendor.riskScore >= 70 && (
                          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                            <div className="font-medium text-red-700 mb-1">High Risk Factors:</div>
                            <ul className="text-red-600 space-y-1">
                              {vendor.riskFactors.map((factor, idx) => (
                                <li key={idx}>• {factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="text-xs">
                          <div className="font-medium text-gray-700 mb-1">Certifications:</div>
                          {vendor.certifications.map((cert, idx) => (
                            <span key={idx} className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs mr-1 mb-1">
                              {cert}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs">
                          <strong>Contingency Level:</strong> 
                          <span className={`ml-1 ${
                            vendor.contingencyLevel === 'high' ? 'text-green-600' :
                            vendor.contingencyLevel === 'medium' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {vendor.contingencyLevel.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'reorder' && (
        <div className="space-y-6">
          {/* Reorder Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{reorderRecommendations.length}</div>
                <div className="text-sm text-gray-600">Pending Orders</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  ${reorderRecommendations.reduce((sum, r) => sum + r.costImpact, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Order Value</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(reorderRecommendations.reduce((sum, r) => sum + r.confidence, 0) / reorderRecommendations.length)}%
                </div>
                <div className="text-sm text-gray-600">Avg AI Confidence</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {reorderRecommendations.filter(r => r.urgency === 'critical').length}
                </div>
                <div className="text-sm text-gray-600">Critical Orders</div>
              </CardContent>
            </Card>
          </div>

          {/* Reorder Recommendations */}
          <div className="space-y-4">
            {reorderRecommendations.map(recommendation => (
              <Card key={recommendation.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{recommendation.itemName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{recommendation.reasoning}</p>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                        recommendation.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                        recommendation.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {recommendation.urgency.toUpperCase()} Priority • {recommendation.confidence}% Confidence
                      </div>
                    </div>
                    <Button
                      variant={recommendation.urgency === 'critical' ? 'destructive' : 'info'}
                      onClick={() => handleImplementReorder(recommendation.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Place Order
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Details */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Order Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span className="font-medium">{recommendation.recommendedQuantity} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Cost:</span>
                          <span className="font-medium">${recommendation.costImpact.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected Delivery:</span>
                          <span className="font-medium">{recommendation.expectedDelivery.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Recommended Vendor:</span>
                          <span className="font-medium text-blue-600">{recommendation.vendorRecommendation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Alternative Options */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Alternative Options</h4>
                      <div className="space-y-3">
                        {recommendation.alternativeOptions.map((option, idx) => (
                          <div key={idx} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-sm">{option.vendor}</span>
                              <span className="text-xs text-green-600">Quality: {option.qualityScore}%</span>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>Quantity: {option.quantity}</div>
                              <div>Cost: ${option.cost.toLocaleString()}</div>
                              <div>Delivery: {option.deliveryDate.toLocaleDateString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risk Mitigation */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Risk Mitigation</h4>
                      <div className="space-y-2">
                        {recommendation.riskMitigation.map((measure, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{measure}</span>
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

      {selectedTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supply Chain Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Supply Chain Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{metrics.demandForecastAccuracy}%</div>
                    <div className="text-sm text-blue-700">Demand Accuracy</div>
                    <div className="text-xs text-blue-500">AI prediction model</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{metrics.onTimeDelivery}%</div>
                    <div className="text-sm text-green-700">On-Time Delivery</div>
                    <div className="text-xs text-green-500">Vendor performance</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{metrics.vendorDiversification}%</div>
                    <div className="text-sm text-purple-700">Vendor Diversification</div>
                    <div className="text-xs text-purple-500">Risk mitigation</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{metrics.automatedOrders}%</div>
                    <div className="text-sm text-orange-700">Automated Orders</div>
                    <div className="text-xs text-orange-500">Process efficiency</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>ROI Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">AI Supply Chain Benefits:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Reduced Stockouts:</span>
                      <span className="font-medium text-green-600">+$285K/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inventory Optimization:</span>
                      <span className="font-medium text-green-600">+$165K/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vendor Cost Savings:</span>
                      <span className="font-medium text-green-600">+$125K/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Process Automation:</span>
                      <span className="font-medium text-green-600">+$95K/month</span>
                    </div>
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">$670K</div>
                  <div className="text-sm text-green-700">Total Monthly Savings</div>
                  <div className="text-xs text-green-500">$8.0M annualized ROI</div>
                </div>
                <div className="text-center text-xs text-gray-600">
                  <p>Addressing $3.2B market opportunity by 2028</p>
                  <p>Post-COVID supply chain resilience</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}