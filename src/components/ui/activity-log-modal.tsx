'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  Calendar,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Building2,
  FileText,
  Settings,
  UserPlus,
  Database,
  Shield,
  TrendingUp
} from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

export interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  type: 'user_action' | 'system_event' | 'alert' | 'data_update' | 'security' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  user?: {
    name: string;
    role: string;
    hospital?: string;
  };
  metadata?: {
    ip?: string;
    duration?: number;
    affected_records?: number;
    location?: string;
  };
}

const mockActivityLogs: ActivityLogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    type: 'user_action',
    severity: 'low',
    title: 'User Login',
    description: 'Dr. Sarah Johnson logged into the system',
    user: { name: 'Dr. Sarah Johnson', role: 'Director', hospital: 'General Hospital' },
    metadata: { ip: '192.168.1.45' }
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    type: 'data_update',
    severity: 'medium',
    title: 'KPI Data Updated',
    description: 'Monthly KPI metrics updated for Emergency Department',
    user: { name: 'System Scheduler', role: 'System' },
    metadata: { affected_records: 156 }
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    type: 'alert',
    severity: 'high',
    title: 'Performance Alert',
    description: 'Patient wait time exceeded threshold in Emergency Department',
    metadata: { location: 'Emergency Department', duration: 45 }
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    type: 'user_action',
    severity: 'low',
    title: 'Report Generated',
    description: 'Monthly performance report generated successfully',
    user: { name: 'Michael Chen', role: 'Manager', hospital: 'City Medical Center' },
    metadata: { affected_records: 1200 }
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    type: 'system_event',
    severity: 'medium',
    title: 'Database Backup',
    description: 'Automated database backup completed successfully',
    metadata: { duration: 23 }
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    type: 'security',
    severity: 'high',
    title: 'Failed Login Attempts',
    description: 'Multiple failed login attempts detected from IP 203.45.67.89',
    metadata: { ip: '203.45.67.89' }
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    type: 'user_action',
    severity: 'low',
    title: 'New User Registration',
    description: '3 new staff members registered at Metro Health Center',
    user: { name: 'Admin System', role: 'Admin' },
    metadata: { affected_records: 3, location: 'Metro Health Center' }
  },
  {
    id: '8',
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    type: 'performance',
    severity: 'medium',
    title: 'AI Model Update',
    description: 'Predictive analytics model updated with latest patient data',
    metadata: { affected_records: 5400, duration: 12 }
  }
];

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  userRole?: string;
}

export function ActivityLogModal({ isOpen, onClose, title = "Recent Activities", userRole = "admin" }: ActivityLogModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredActivities = useMemo(() => {
    return mockActivityLogs.filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (activity.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesType = selectedType === 'all' || activity.type === selectedType;
      const matchesSeverity = selectedSeverity === 'all' || activity.severity === selectedSeverity;
      
      return matchesSearch && matchesType && matchesSeverity;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [searchTerm, selectedType, selectedSeverity]);

  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredActivities.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredActivities, currentPage]);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_action': return <User className="h-4 w-4" />;
      case 'system_event': return <Settings className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'data_update': return <Database className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">Comprehensive system activity log</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="user_action">User Actions</option>
              <option value="system_event">System Events</option>
              <option value="alert">Alerts</option>
              <option value="data_update">Data Updates</option>
              <option value="security">Security</option>
              <option value="performance">Performance</option>
            </select>
            
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Total: {filteredActivities.length}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedSeverity('all');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {paginatedActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${getSeverityColor(activity.severity)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          
                          {activity.user && (
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-gray-500">by</span>
                              <span className="text-xs font-medium text-gray-700">{activity.user.name}</span>
                              <span className="text-xs text-gray-500">({activity.user.role})</span>
                              {activity.user.hospital && (
                                <>
                                  <span className="text-xs text-gray-500">at</span>
                                  <span className="text-xs text-gray-600">{activity.user.hospital}</span>
                                </>
                              )}
                            </div>
                          )}
                          
                          {activity.metadata && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {activity.metadata.ip && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  IP: {activity.metadata.ip}
                                </span>
                              )}
                              {activity.metadata.duration && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                  {activity.metadata.duration}min
                                </span>
                              )}
                              {activity.metadata.affected_records && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  {activity.metadata.affected_records} records
                                </span>
                              )}
                              {activity.metadata.location && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                                  {activity.metadata.location}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getSeverityColor(activity.severity)}`}>
                            {activity.severity}
                          </span>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {activity.timestamp.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of {filteredActivities.length} activities
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + Math.max(1, currentPage - 2);
                  if (pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}