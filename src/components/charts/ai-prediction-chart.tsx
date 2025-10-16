"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from "lucide-react";
import type { AiPrediction, ChartDataPoint } from "@/types";

interface AiPredictionChartProps {
  prediction: AiPrediction;
  historicalData: ChartDataPoint[];
  className?: string;
}

export function AiPredictionChart({ prediction, historicalData, className }: AiPredictionChartProps) {
  // Combine historical and predicted data
  const chartData = [
    ...historicalData,
    {
      date: "Predicted",
      value: prediction.predictedValue,
      isPredicted: true,
      label: "AI Prediction"
    }
  ];

  const getTrendIcon = () => {
    switch (prediction.currentTrend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 bg-green-50";
    if (confidence >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              {getTrendIcon()}
              <span>{prediction.kpiName} - AI Prediction</span>
            </CardTitle>
            <CardDescription>
              {prediction.predictionPeriod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} forecast
            </CardDescription>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getConfidenceColor(prediction.confidence)}`}>
            {getConfidenceIcon(prediction.confidence)}
            <span>{prediction.confidence}% confident</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Prediction Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-600 font-medium">Predicted Value</p>
              <p className="text-2xl font-bold text-blue-800">{prediction.predictedValue.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-600 font-medium">Current Trend</p>
              <p className="text-lg font-semibold capitalize flex items-center space-x-1">
                {getTrendIcon()}
                <span>{prediction.currentTrend}</span>
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-purple-600 font-medium">Valid Until</p>
              <p className="text-lg font-semibold text-purple-800">
                {new Date(prediction.validUntil).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number | string, name: string) => [
                    typeof value === 'number' ? value.toLocaleString() : String(value),
                    name
                  ]}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="KPI Value"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
                <ReferenceLine 
                  x="Predicted" 
                  stroke="#8b5cf6" 
                  strokeDasharray="2 2"
                  label={{ value: "AI Prediction", position: "top" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Influencing Factors */}
          {prediction.factors.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Key Influencing Factors</h4>
              <div className="flex flex-wrap gap-2">
                {prediction.factors.map((factor, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}