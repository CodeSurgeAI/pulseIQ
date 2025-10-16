'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { withAuth } from '@/hooks/use-auth';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye,
  Bell,
  Filter,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/utils';
import { mockAlerts } from '@/utils/mock-data';
import { Alert as BaseAlert } from '@/types';

// Extended alert interface for this component
interface Alert extends BaseAlert {
  message?: string;
  category?: string;
  department?: string;
  timestamp?: Date;
  status?: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  assignedTo?: string;
}

function DirectorAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleAlertAction = (alertId: string, action: 'acknowledge' | 'resolve' | 'dismiss') => {
    setAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        let newStatus: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
        switch (action) {
          case 'acknowledge':
            newStatus = 'acknowledged';
            break;
          case 'resolve':
            newStatus = 'resolved';
            break;
          case 'dismiss':
            newStatus = 'dismissed';
            break;
          default:
            return alert;
        }
        return { ...alert, status: newStatus };
      }
      return alert;
    }));
  };

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowDetailModal(true);
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getStatusIcon = (status: 'active' | 'acknowledged' | 'resolved' | 'dismissed') => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'acknowledged':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'dismissed':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false;
    return true;
  });

  const alertCounts = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
  };

  return (
    <>
      <DashboardLayout title="Alert Management">
        <div className="space-y-6">
          {/* Alert Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                    <p className="text-2xl font-bold text-gray-900">{alertCounts.total}</p>
                  </div>
                  <Bell className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-red-600">{alertCounts.active}</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical</p>
                    <p className="text-2xl font-bold text-orange-600">{alertCounts.critical}</p>
                  </div>
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Acknowledged</p>
                    <p className="text-2xl font-bold text-blue-600">{alertCounts.acknowledged}</p>
                  </div>
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={cn("transition-all duration-200", getSeverityColor(alert.severity))}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {alert.title}
                          </h3>
                          {getStatusIcon(alert.status || 'active')}
                          <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-60 capitalize">
                            {alert.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3">
                          {alert.message}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {alert.timestamp?.toLocaleString() || alert.createdAt.toLocaleString()}
                          </span>
                          {alert.department && (
                            <span>Department: {alert.department}</span>
                          )}
                          <span className="capitalize">Category: {alert.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(alert)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {alert.status === 'active' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                          >
                            Acknowledge
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAlertAction(alert.id, 'resolve')}
                          >
                            Resolve
                          </Button>
                        </>
                      )}
                      
                      {alert.status === 'acknowledged' && (
                        <Button
                          size="sm"
                          onClick={() => handleAlertAction(alert.id, 'resolve')}
                        >
                          Resolve
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAlertAction(alert.id, 'dismiss')}
                        className="text-gray-500"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredAlerts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No alerts found
                </h3>
                <p className="text-gray-600">
                  {filterSeverity !== 'all' || filterStatus !== 'all' 
                    ? 'Try adjusting your filters to see more alerts.'
                    : 'All systems are operating normally.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={selectedAlert.title}
          description={`Alert Details - ${selectedAlert.category}`}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Severity</div>
                <div className={cn("text-lg font-semibold capitalize", 
                  selectedAlert.severity === 'critical' ? 'text-red-600' :
                  selectedAlert.severity === 'high' ? 'text-orange-600' :
                  selectedAlert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                )}>
                  {selectedAlert.severity}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
                <div className="text-lg font-semibold capitalize text-gray-900">
                  {selectedAlert.status}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{selectedAlert.message}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Category:</span>
                <span className="ml-2 capitalize">{selectedAlert.category}</span>
              </div>
              {selectedAlert.department && (
                <div>
                  <span className="font-medium text-gray-500">Department:</span>
                  <span className="ml-2">{selectedAlert.department}</span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-500">Created:</span>
                <span className="ml-2">{selectedAlert.timestamp?.toLocaleString() || selectedAlert.createdAt.toLocaleString()}</span>
              </div>
              {selectedAlert.assignedTo && (
                <div>
                  <span className="font-medium text-gray-500">Assigned to:</span>
                  <span className="ml-2">{selectedAlert.assignedTo}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              {selectedAlert.status === 'active' && (
                <Button onClick={() => {
                  handleAlertAction(selectedAlert.id, 'acknowledge');
                  setShowDetailModal(false);
                }}>
                  Acknowledge
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default withAuth(DirectorAlertsPage, { requiredRole: 'director' });