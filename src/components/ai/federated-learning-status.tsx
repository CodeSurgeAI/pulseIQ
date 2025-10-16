"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Network, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Database, 
  TrendingUp,
  Calendar,
  Activity,
  Zap
} from "lucide-react";
import type { FederatedLearningStatus } from "@/types";

interface FederatedLearningStatusProps {
  statuses: FederatedLearningStatus[];
  className?: string;
}

export function FederatedLearningStatus({ statuses, className }: FederatedLearningStatusProps) {
  const getStatusColor = (status: FederatedLearningStatus['trainingStatus']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'training':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'syncing':
        return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'error':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: FederatedLearningStatus['trainingStatus']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'training':
        return <Zap className="h-4 w-4" />;
      case 'syncing':
        return <Activity className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getDataQualityColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return 'text-gray-500';
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalHospitals = statuses.length;
  const activeTraining = statuses.filter(s => s.trainingStatus === 'training').length;
  const completedToday = statuses.filter(s => {
    if (s.trainingStatus !== 'completed' || !s.lastTrainingRun) return false;
    const today = new Date();
    const lastRun = new Date(s.lastTrainingRun);
    return lastRun.toDateString() === today.toDateString();
  }).length;
  const withErrors = statuses.filter(s => s.trainingStatus === 'error').length;

  const averageAccuracy = statuses.reduce((sum, s) => sum + (s.modelAccuracy || 0), 0) / totalHospitals;
  const totalSamples = statuses.reduce((sum, s) => sum + s.contributedSamples, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Network className="h-5 w-5 text-blue-500" />
          <span>Federated Learning Network</span>
        </CardTitle>
        <CardDescription>
          Real-time status of distributed model training across hospital network
        </CardDescription>
        
        {/* Network Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="text-center bg-blue-50 p-3 rounded-lg">
            <p className="font-bold text-2xl text-blue-600">{totalHospitals}</p>
            <p className="text-sm text-blue-800">Total Hospitals</p>
          </div>
          <div className="text-center bg-green-50 p-3 rounded-lg">
            <p className="font-bold text-2xl text-green-600">{activeTraining}</p>
            <p className="text-sm text-green-800">Training Now</p>
          </div>
          <div className="text-center bg-purple-50 p-3 rounded-lg">
            <p className="font-bold text-2xl text-purple-600">{totalSamples.toLocaleString()}</p>
            <p className="text-sm text-purple-800">Total Samples</p>
          </div>
          <div className="text-center bg-yellow-50 p-3 rounded-lg">
            <p className="font-bold text-2xl text-yellow-600">{averageAccuracy.toFixed(1)}%</p>
            <p className="text-sm text-yellow-800">Avg Accuracy</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Hospital Status Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {statuses.map((status) => (
              <div
                key={status.hospitalId}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Hospital Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{status.hospitalName}</h4>
                    <p className="text-sm text-gray-600">Model v{status.modelVersion}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(status.trainingStatus)}`}>
                    {getStatusIcon(status.trainingStatus)}
                    <span>{status.trainingStatus.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Progress Bar for Syncing */}
                {status.trainingStatus === 'syncing' && status.syncProgress && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sync Progress</span>
                      <span>{status.syncProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${status.syncProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Database className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Samples</span>
                    </div>
                    <p className="text-lg font-bold">{status.contributedSamples.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Accuracy</span>
                    </div>
                    <p className={`text-lg font-bold ${getAccuracyColor(status.modelAccuracy)}`}>
                      {status.modelAccuracy ? `${status.modelAccuracy.toFixed(1)}%` : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Data Quality Score */}
                {status.dataQualityScore && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Data Quality Score</span>
                      <span className={`font-bold ${getDataQualityColor(status.dataQualityScore)}`}>
                        {status.dataQualityScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status.dataQualityScore >= 90 ? 'bg-green-500' :
                          status.dataQualityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${status.dataQualityScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>Last Training: {new Date(status.lastTrainingRun).toLocaleString()}</span>
                  </div>
                  {status.nextScheduledTraining && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>Next Training: {new Date(status.nextScheduledTraining).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Errors */}
                {status.errors && status.errors.length > 0 && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-800">Recent Errors</span>
                    </div>
                    <div className="space-y-1">
                      {status.errors.slice(0, 2).map((error, index) => (
                        <p key={index} className="text-xs text-red-700">{error}</p>
                      ))}
                      {status.errors.length > 2 && (
                        <p className="text-xs text-red-600 italic">
                          +{status.errors.length - 2} more errors
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Network Health Summary */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Network Health Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-green-800 mb-2">Training Completed Today</h5>
                <p className="text-2xl font-bold text-green-600">{completedToday}</p>
                <p className="text-sm text-green-700">hospitals successfully trained</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h5 className="font-medium text-red-800 mb-2">Training Errors</h5>
                <p className="text-2xl font-bold text-red-600">{withErrors}</p>
                <p className="text-sm text-red-700">hospitals with errors</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">Network Participation</h5>
                <p className="text-2xl font-bold text-blue-600">
                  {((totalHospitals - withErrors) / totalHospitals * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-blue-700">hospitals participating</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}