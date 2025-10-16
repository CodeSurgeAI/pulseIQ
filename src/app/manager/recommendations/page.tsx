'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AiRecommendationsPanel } from '@/components/ai/ai-recommendations-panel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { withAuth } from '@/hooks/use-auth';
import { 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Target,
  Users,
  BarChart3,
  AlertTriangle,
  Calendar,
  Plus
} from 'lucide-react';
import { cn } from '@/utils';
import { mockAiRecommendations } from '@/utils/mock-data';
import { AiRecommendation } from '@/types';

interface ImplementationPlan {
  id: string;
  recommendationId: string;
  title: string;
  description: string;
  steps: string[];
  assignedTo: string;
  dueDate: Date;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'high' | 'medium' | 'low';
  resources: string[];
  estimatedCost?: number;
  expectedImpact: string;
}

function ManagerRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>(mockAiRecommendations);
  const [implementationPlans, setImplementationPlans] = useState<ImplementationPlan[]>([
    {
      id: '1',
      recommendationId: '1',
      title: 'Implement Digital Triage System',
      description: 'Deploy AI-powered triage system to reduce wait times',
      steps: [
        'Conduct vendor evaluation',
        'Secure budget approval',
        'Staff training program',
        'Pilot testing in ED',
        'Full rollout'
      ],
      assignedTo: 'Dr. Sarah Johnson',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'in_progress',
      priority: 'high',
      resources: ['IT Staff', 'Clinical Training', 'Vendor Support'],
      estimatedCost: 45000,
      expectedImpact: '15% reduction in average wait time'
    }
  ]);

  const [selectedRecommendation, setSelectedRecommendation] = useState<AiRecommendation | null>(null);
  const [showImplementationModal, setShowImplementationModal] = useState(false);

  const handleUpdateRecommendationStatus = (recommendationId: string, status: AiRecommendation['status']) => {
    setRecommendations(prev => prev.map(rec => 
      rec.id === recommendationId ? { ...rec, status } : rec
    ));

    // Show success message
    const statusMessages: Record<AiRecommendation['status'], string> = {
      in_progress: 'Recommendation marked as in progress',
      completed: 'Recommendation marked as completed',
      dismissed: 'Recommendation dismissed',
      pending: 'Recommendation status updated'
    };
    
    alert(statusMessages[status] || 'Status updated');
  };

  const handleAssignRecommendation = (recommendationId: string, userId: string) => {
    // In a real app, this would integrate with user management
    alert(`Recommendation assigned to user: ${userId}`);
  };

  const handleCreateImplementationPlan = (recommendation: AiRecommendation) => {
    setSelectedRecommendation(recommendation);
    setShowImplementationModal(true);
  };

  const getStatusIcon = (status: ImplementationPlan['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'on_hold':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ImplementationPlan['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: ImplementationPlan['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  // Statistics
  const stats = {
    totalRecommendations: recommendations.length,
    active: recommendations.filter(r => r.status === 'pending' || r.status === 'in_progress').length,
    completed: recommendations.filter(r => r.status === 'completed').length,
    implementations: implementationPlans.length,
  };

  return (
    <>
      <DashboardLayout title="AI Recommendations">
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Recommendations</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalRecommendations}</p>
                  </div>
                  <Lightbulb className="h-6 w-6 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Implementation Plans</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.implementations}</p>
                  </div>
                  <Target className="h-6 w-6 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations Panel */}
          <AiRecommendationsPanel
            recommendations={recommendations}
            onUpdateStatus={handleUpdateRecommendationStatus}
            onAssignRecommendation={handleAssignRecommendation}
          />

          {/* Implementation Plans */}
          {implementationPlans.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  <span>Implementation Plans</span>
                </CardTitle>
                <CardDescription>
                  Track progress of recommendation implementations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {implementationPlans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {plan.title}
                          </h3>
                          <div className={cn(
                            'inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border',
                            getStatusColor(plan.status)
                          )}>
                            {getStatusIcon(plan.status)}
                            <span className="capitalize">{plan.status.replace('_', ' ')}</span>
                          </div>
                          <div className={cn(
                            'px-2 py-1 rounded text-xs font-medium capitalize',
                            getPriorityColor(plan.priority)
                          )}>
                            {plan.priority}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{plan.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">Assigned to:</span>
                            <span className="ml-2">{plan.assignedTo}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Due Date:</span>
                            <span className="ml-2">{plan.dueDate.toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Expected Impact:</span>
                            <span className="ml-2">{plan.expectedImpact}</span>
                          </div>
                          {plan.estimatedCost && (
                            <div>
                              <span className="font-medium text-gray-500">Est. Cost:</span>
                              <span className="ml-2">${plan.estimatedCost.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Implementation Steps</h4>
                      <div className="space-y-1">
                        {plan.steps.map((step, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <div className={cn(
                              'w-4 h-4 rounded-full flex items-center justify-center text-xs',
                              index < 2 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                            )}>
                              {index < 2 ? '✓' : index + 1}
                            </div>
                            <span className={index < 2 ? 'line-through text-gray-500' : 'text-gray-700'}>
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Required Resources</h4>
                      <div className="flex flex-wrap gap-2">
                        {plan.resources.map((resource, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks for managing recommendations and implementations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col space-y-2"
                  onClick={() => alert('Opening recommendation analysis dashboard')}
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex-col space-y-2"
                  onClick={() => alert('Opening team collaboration tools')}
                >
                  <Users className="h-6 w-6" />
                  <span>Team Collaboration</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex-col space-y-2"
                  onClick={() => alert('Generating monthly recommendation report')}
                >
                  <Calendar className="h-6 w-6" />
                  <span>Monthly Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>

      {/* Implementation Plan Modal */}
      <Modal
        isOpen={showImplementationModal}
        onClose={() => setShowImplementationModal(false)}
        title="Create Implementation Plan"
        description={selectedRecommendation ? `Plan for: ${selectedRecommendation.title}` : ''}
        size="xl"
      >
        <div className="space-y-6">
          {selectedRecommendation && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Recommendation Details</h3>
              <p className="text-blue-800 text-sm">{selectedRecommendation.description}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-blue-700">
                <span>Priority: {selectedRecommendation.priority}</span>
                <span>Category: {selectedRecommendation.category}</span>
                <span>Expected Impact: High</span>
              </div>
            </div>
          )}

          <div className="text-center py-8">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Implementation Planning
            </h3>
            <p className="text-gray-600 mb-4">
              This feature would allow you to create detailed implementation plans with timelines, resource allocation, and progress tracking.
            </p>
            <div className="flex justify-center space-x-2">
              <Button variant="outline" onClick={() => setShowImplementationModal(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setShowImplementationModal(false);
                alert('Implementation plan template will be created');
              }}>
                Create Plan Template
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default withAuth(ManagerRecommendationsPage, { requiredRole: 'manager' });