"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Clock, CheckCircle, XCircle, AlertTriangle, Target, TrendingUp, User, Calendar } from "lucide-react";
import type { AiRecommendation } from "@/types";

interface AiRecommendationsPanelProps {
  recommendations: AiRecommendation[];
  onUpdateStatus?: (recommendationId: string, status: AiRecommendation['status']) => void;
  onAssignRecommendation?: (recommendationId: string, userId: string) => void;
  className?: string;
}

export function AiRecommendationsPanel({ 
  recommendations, 
  onUpdateStatus, 
  onAssignRecommendation, 
  className 
}: AiRecommendationsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const getPriorityColor = (priority: AiRecommendation['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-500 bg-red-50 text-red-800';
      case 'high':
        return 'border-orange-500 bg-orange-50 text-orange-800';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      default:
        return 'border-blue-500 bg-blue-50 text-blue-800';
    }
  };

  const getPriorityIcon = (priority: AiRecommendation['priority']) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: AiRecommendation['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'dismissed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-orange-600 bg-orange-100';
    }
  };

  const getStatusIcon = (status: AiRecommendation['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'dismissed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: AiRecommendation['category']) => {
    switch (category) {
      case 'operational':
        return 'bg-blue-100 text-blue-800';
      case 'clinical':
        return 'bg-green-100 text-green-800';
      case 'financial':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-indigo-100 text-indigo-800';
    }
  };

  // Filter recommendations
  const filteredRecommendations = recommendations.filter(rec => {
    const categoryMatch = selectedCategory === 'all' || rec.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || rec.priority === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  const categories = ['all', 'operational', 'clinical', 'financial', 'strategic'];
  const priorities = ['all', 'urgent', 'high', 'medium', 'low'];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <span>AI-Powered Recommendations</span>
        </CardTitle>
        <CardDescription>
          Intelligent suggestions to improve hospital performance and KPIs
        </CardDescription>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 pt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-sm">
          <div className="text-center">
            <p className="font-bold text-lg text-red-600">{recommendations.filter(r => r.priority === 'urgent').length}</p>
            <p className="text-gray-600">Urgent</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-blue-600">{recommendations.filter(r => r.status === 'in_progress').length}</p>
            <p className="text-gray-600">In Progress</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-green-600">{recommendations.filter(r => r.status === 'completed').length}</p>
            <p className="text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-orange-600">{recommendations.filter(r => r.status === 'pending').length}</p>
            <p className="text-gray-600">Pending</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className={`border-l-4 p-4 rounded-r-lg ${getPriorityColor(recommendation.priority)}`}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getPriorityIcon(recommendation.priority)}
                        <span className="font-semibold text-lg">{recommendation.title}</span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getCategoryColor(recommendation.category)}`}>
                          {recommendation.category}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(recommendation.priority)}`}>
                          {recommendation.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getStatusColor(recommendation.status)}`}>
                          {getStatusIcon(recommendation.status)}
                          <span>{recommendation.status.replace('_', ' ')}</span>
                        </span>
                        <span className="flex items-center space-x-1 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{recommendation.estimatedTimeframe}</span>
                        </span>
                        <span className="flex items-center space-x-1 text-gray-600">
                          <Target className="h-4 w-4" />
                          <span>{recommendation.confidence}% confidence</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700">{recommendation.description}</p>

                  {/* Estimated Impact */}
                  {recommendation.estimatedImpact.length > 0 && (
                    <div className="bg-white/60 p-3 rounded-lg">
                      <h5 className="font-semibold mb-2 flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span>Estimated Impact</span>
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {recommendation.estimatedImpact.slice(0, 4).map((impact, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                            <span className="font-medium">KPI {index + 1}</span>
                            <span className="text-green-600 font-bold">
                              +{impact.improvementPercentage.toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Implementation Steps */}
                  {recommendation.implementationSteps.length > 0 && (
                    <div className="bg-white/60 p-3 rounded-lg">
                      <h5 className="font-semibold mb-2">Implementation Steps</h5>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {recommendation.implementationSteps.slice(0, 3).map((step, index) => (
                          <li key={index} className="text-gray-700">{step}</li>
                        ))}
                        {recommendation.implementationSteps.length > 3 && (
                          <li className="text-gray-500 italic">
                            +{recommendation.implementationSteps.length - 3} more steps...
                          </li>
                        )}
                      </ol>
                    </div>
                  )}

                  {/* Assignment Info */}
                  {recommendation.assignedTo && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>Assigned to: {recommendation.assignedTo}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Created: {new Date(recommendation.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {onUpdateStatus && (
                      <div className="flex items-center space-x-2">
                        {recommendation.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onUpdateStatus(recommendation.id, 'in_progress')}
                              className="text-xs"
                            >
                              Start Implementation
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onUpdateStatus(recommendation.id, 'dismissed')}
                              className="text-xs text-gray-500"
                            >
                              Dismiss
                            </Button>
                          </>
                        )}
                        {recommendation.status === 'in_progress' && (
                          <Button
                            size="sm"
                            onClick={() => onUpdateStatus(recommendation.id, 'completed')}
                            className="text-xs"
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No recommendations found</p>
              <p className="text-sm text-gray-500 mt-1">
                {selectedCategory !== 'all' || selectedPriority !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'AI recommendations will appear here as they become available'
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}