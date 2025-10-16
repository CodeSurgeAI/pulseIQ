"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Server, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Activity, 
  Clock,
  Cpu,
  HardDrive,
  MemoryStick,
  Zap,
  Database,
  TrendingUp
} from "lucide-react";
import type { MlGatewayStatus } from "@/types";

interface MlGatewayStatusProps {
  status: MlGatewayStatus;
  className?: string;
}

export function MlGatewayStatusComponent({ status, className }: MlGatewayStatusProps) {
  const getStatusColor = (statusValue: MlGatewayStatus['status']) => {
    switch (statusValue) {
      case 'online':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'maintenance':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-red-600 bg-red-100 border-red-200';
    }
  };

  const getStatusIcon = (statusValue: MlGatewayStatus['status']) => {
    switch (statusValue) {
      case 'online':
        return <CheckCircle className="h-5 w-5" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5" />;
      case 'maintenance':
        return <Clock className="h-5 w-5" />;
      default:
        return <XCircle className="h-5 w-5" />;
    }
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 100) return 'text-green-600';
    if (responseTime < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getErrorRateColor = (errorRate: number) => {
    if (errorRate < 1) return 'text-green-600';
    if (errorRate < 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResourceColor = (usage: number) => {
    if (usage < 70) return 'text-green-600 bg-green-500';
    if (usage < 85) return 'text-yellow-600 bg-yellow-500';
    return 'text-red-600 bg-red-500';
  };

  const formatUptime = (lastHealthCheck: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(lastHealthCheck).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours % 24}h`;
    }
    return `${diffHours}h`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="h-5 w-5 text-blue-500" />
            <span>ML Gateway Status</span>
          </div>
          <div className={`px-3 py-2 rounded-lg border flex items-center space-x-2 ${getStatusColor(status.status)}`}>
            {getStatusIcon(status.status)}
            <span className="font-medium capitalize">{status.status}</span>
          </div>
        </CardTitle>
        <CardDescription>
          Machine Learning Gateway health and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Activity className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-800 font-medium">Version</p>
              <p className="text-xl font-bold text-blue-600">v{status.version}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-800 font-medium">Response Time</p>
              <p className={`text-xl font-bold ${getResponseTimeColor(status.responseTime)}`}>
                {status.responseTime}ms
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Database className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-purple-800 font-medium">Queue Size</p>
              <p className="text-xl font-bold text-purple-600">{status.queueSize}</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-orange-800 font-medium">Processed (24h)</p>
              <p className="text-xl font-bold text-orange-600">{status.processedRequests24h.toLocaleString()}</p>
            </div>
          </div>

          {/* System Resources */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Server className="h-4 w-4" />
              <span>System Resources</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CPU Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">CPU Usage</span>
                  </div>
                  <span className={`font-bold ${getResourceColor(status.systemResources.cpuUsage).split(' ')[0]}`}>
                    {status.systemResources.cpuUsage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getResourceColor(status.systemResources.cpuUsage).split(' ')[1]}`}
                    style={{ width: `${status.systemResources.cpuUsage}%` }}
                  ></div>
                </div>
              </div>

              {/* Memory Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MemoryStick className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Memory Usage</span>
                  </div>
                  <span className={`font-bold ${getResourceColor(status.systemResources.memoryUsage).split(' ')[0]}`}>
                    {status.systemResources.memoryUsage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getResourceColor(status.systemResources.memoryUsage).split(' ')[1]}`}
                    style={{ width: `${status.systemResources.memoryUsage}%` }}
                  ></div>
                </div>
              </div>

              {/* Disk Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Disk Usage</span>
                  </div>
                  <span className={`font-bold ${getResourceColor(status.systemResources.diskUsage).split(' ')[0]}`}>
                    {status.systemResources.diskUsage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getResourceColor(status.systemResources.diskUsage).split(' ')[1]}`}
                    style={{ width: `${status.systemResources.diskUsage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Models */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Active Models ({status.activeModels.length})</span>
            </h4>
            
            {status.activeModels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {status.activeModels.map((model, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">{model}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <XCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No active models</p>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-3">Error Rate</h5>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full transition-all duration-300 ${
                        status.errorRate < 1 ? 'bg-green-500' :
                        status.errorRate < 5 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(status.errorRate, 10) * 10}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`ml-3 text-xl font-bold ${getErrorRateColor(status.errorRate)}`}>
                  {status.errorRate.toFixed(2)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {status.errorRate < 1 ? 'Excellent' : 
                 status.errorRate < 5 ? 'Acceptable' : 'Needs attention'}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-3">System Health</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Last Health Check:</span>
                  <span className="font-medium">
                    {new Date(status.lastHealthCheck).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="font-medium text-green-600">
                    {formatUptime(status.lastHealthCheck)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-medium ${
                    status.status === 'online' ? 'text-green-600' : 
                    status.status === 'degraded' ? 'text-yellow-600' : 
                    status.status === 'maintenance' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {status.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {status.status !== 'online' && (
            <div className={`p-4 rounded-lg border ${
              status.status === 'maintenance' ? 'bg-blue-50 border-blue-200 text-blue-800' :
              status.status === 'degraded' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center space-x-2">
                {getStatusIcon(status.status)}
                <span className="font-semibold">
                  {status.status === 'maintenance' ? 'System Maintenance' :
                   status.status === 'degraded' ? 'Degraded Performance' : 'System Offline'}
                </span>
              </div>
              <p className="mt-1 text-sm">
                {status.status === 'maintenance' 
                  ? 'The ML Gateway is currently undergoing scheduled maintenance. Some features may be temporarily unavailable.'
                  : status.status === 'degraded'
                  ? 'The ML Gateway is experiencing performance issues. Response times may be slower than usual.'
                  : 'The ML Gateway is currently offline. Please contact system administrators if this persists.'
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}