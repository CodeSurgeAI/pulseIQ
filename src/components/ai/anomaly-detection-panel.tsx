"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, XCircle, TrendingUp, TrendingDown, Download, Users, Zap, RefreshCw, FileText, Info, Eye, BarChart3 } from "lucide-react";
import type { AiAnomaly } from "@/types";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/toast";

interface AnomalyDetectionPanelProps {
  anomalies: AiAnomaly[];
  onResolveAnomaly?: (anomalyId: string) => void;
  className?: string;
}

export function AnomalyDetectionPanel({ anomalies, onResolveAnomaly, className }: AnomalyDetectionPanelProps) {
  const { showAlert } = useAlert();
  const { showInfo, showSuccess, showError, showWarning } = useToast();
  
  const getSeverityColor = (severity: AiAnomaly['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50 text-red-800';
      case 'high':
        return 'border-orange-500 bg-orange-50 text-orange-800';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      default:
        return 'border-blue-500 bg-blue-50 text-blue-800';
    }
  };

  const getSeverityIcon = (severity: AiAnomaly['severity']) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAnomalyDirection = (anomaly: AiAnomaly) => {
    const { detectedValue, expectedRange } = anomaly;
    if (detectedValue > expectedRange.max) {
      return { direction: 'above', icon: <TrendingUp className="h-4 w-4" /> };
    } else if (detectedValue < expectedRange.min) {
      return { direction: 'below', icon: <TrendingDown className="h-4 w-4" /> };
    }
    return { direction: 'within', icon: <CheckCircle className="h-4 w-4" /> };
  };

  // Mock data for resolved anomalies (in real app, this would come from props or state)
  const resolvedAnomalies = [
    {
      id: "resolved-1",
      kpiName: "Patient Wait Times",
      severity: 'medium' as const,
      resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      resolvedBy: "Dr. Smith",
      description: "Average wait times exceeded target",
      detectedValue: 35,
      expectedRange: { min: 15, max: 25 }
    },
    {
      id: "resolved-2", 
      kpiName: "Staff Utilization",
      severity: 'high' as const,
      resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      resolvedBy: "Manager Johnson",
      description: "Understaffed during peak hours",
      detectedValue: 0.65,
      expectedRange: { min: 0.75, max: 0.95 }
    }
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>AI Anomaly Detection</span>
            </CardTitle>
            <CardDescription>
              Real-time monitoring of KPI anomalies using machine learning
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              icon={<Download className="h-4 w-4" />}
              onClick={() => {
                showSuccess('Export Started', 'Anomaly report is being generated...');
                // In a real app, this would trigger a download
              }}
            >
              Export
            </Button>
            <Button
              size="sm"
              variant="info"
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={() => {
                showInfo('Refreshing', 'Refreshing anomaly detection...');
                // In a real app, this would trigger a fresh scan
              }}
            >
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* AI Status Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-800">AI Engine Active</span>
              <span className="text-xs text-gray-600">Last scan: 2 minutes ago</span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-600">
              <span className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>47 KPIs monitored</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>99.9% uptime</span>
              </span>
            </div>
          </div>
        </div>

        {/* Active Anomalies */}
        <div className="space-y-4">
          {anomalies.length > 0 ? (
            <div className="space-y-3">
              {anomalies.map((anomaly) => {
                const direction = getAnomalyDirection(anomaly);
                return (
                  <div
                    key={anomaly.id}
                    className={`border rounded-lg p-4 ${getSeverityColor(anomaly.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getSeverityIcon(anomaly.severity)}
                          <h4 className="font-semibold text-gray-900">{anomaly.kpiName}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(anomaly.severity)}`}>
                            {anomaly.severity.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{anomaly.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="bg-white/50 rounded p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-600">Detected Value</span>
                              <div className="flex items-center space-x-1">
                                {direction.icon}
                                <span className="text-sm font-semibold">{anomaly.detectedValue.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white/50 rounded p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-600">Expected Range</span>
                              <span className="text-sm font-semibold">
                                {anomaly.expectedRange.min.toLocaleString()} - {anomaly.expectedRange.max.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>Detected {new Date(anomaly.detectedAt).toLocaleString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <BarChart3 className="h-3 w-3" />
                              <span>Confidence: {anomaly.confidence}%</span>
                            </span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              icon={<Eye className="h-4 w-4" />}
                              onClick={() => {
                                const details = `
🚨 ANOMALY DETECTED

KPI: ${anomaly.kpiName}
Severity: ${anomaly.severity.toUpperCase()}
Detected: ${new Date(anomaly.detectedAt).toLocaleDateString()}
Confidence: ${anomaly.confidence}%

📊 VALUES:
Detected: ${anomaly.detectedValue.toLocaleString()}
Expected Range: ${anomaly.expectedRange.min.toLocaleString()} - ${anomaly.expectedRange.max.toLocaleString()}

📋 ANALYSIS:
${anomaly.description}

⚠️ POSSIBLE CAUSES:
${anomaly.possibleCauses.map((cause, i) => `• ${cause}`).join('\n')}
                                `;
                                
                                showAlert({
                                  type: 'info',
                                  title: 'Anomaly Details',
                                  message: details
                                });
                              }}
                              className="text-xs"
                            >
                              Details
                            </Button>
                            {onResolveAnomaly && (
                              <Button
                                size="sm"
                                variant="success"
                                icon={<CheckCircle className="h-4 w-4" />}
                                onClick={() => {
                                  onResolveAnomaly(anomaly.id);
                                  showSuccess('Resolved', `${anomaly.kpiName} anomaly marked as resolved`);
                                }}
                                className="text-xs"
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-2">No active anomalies detected</p>
              <p className="text-sm text-gray-500 mb-4">AI monitoring shows all KPIs within expected ranges</p>
              <Button
                size="sm"
                onClick={() => {
                  showAlert({
                    type: 'success',
                    title: 'AI Monitoring Status',
                    message: '• Total Scans Today: 47\n• Anomalies Detected: 0\n• System Uptime: 99.9%\n• Last Update: Just now\n\n🎯 All systems operating normally'
                  });
                }}
              >
                View Status
              </Button>
            </div>
          )}

          {/* Recently Resolved Anomalies */}
          {resolvedAnomalies.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Recently Resolved ({resolvedAnomalies.length})</span>
                </h4>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<FileText className="h-4 w-4" />}
                  onClick={() => {
                    const details = resolvedAnomalies.map((a, i) => 
                      `${i + 1}. ${a.kpiName} - Resolved ${a.resolvedAt ? new Date(a.resolvedAt).toLocaleDateString() : 'Recently'}`
                    ).join('\n');
                    showAlert({
                      type: 'success',
                      title: 'Resolved Anomalies',
                      message: details
                    });
                  }}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-2">
                {resolvedAnomalies.map((anomaly, index) => (
                  <div key={anomaly.id} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{anomaly.kpiName}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {anomaly.resolvedAt ? new Date(anomaly.resolvedAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<Info className="h-4 w-4" />}
                        onClick={() => {
                          const details = `
📋 RESOLVED ANOMALY

KPI: ${anomaly.kpiName}
Severity: ${anomaly.severity.toUpperCase()}
Resolved: ${anomaly.resolvedAt ? new Date(anomaly.resolvedAt).toLocaleDateString() : 'Recently'}
${anomaly.resolvedBy ? `Resolved By: ${anomaly.resolvedBy}` : ''}

Original Issue: ${anomaly.description}
Detected Value: ${anomaly.detectedValue.toLocaleString()}
Expected Range: ${anomaly.expectedRange.min} - ${anomaly.expectedRange.max}

✅ Status: Complete
                          `;
                          showAlert({
                            type: 'success',
                            title: 'Resolved Anomaly Details',
                            message: details
                          });
                        }}
                        className="text-xs"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}