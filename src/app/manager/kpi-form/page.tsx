'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal, ConfirmModal } from '@/components/ui/modal';
import { withAuth } from '@/hooks/use-auth';
import { 
  ClipboardList, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  Eye,
  Calendar,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/utils';

interface KPIEntry {
  id: string;
  kpiName: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: string;
  comments?: string;
  submissionDate: Date;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

function ManagerKPIFormPage() {
  const [kpiEntries, setKpiEntries] = useState<KPIEntry[]>([
    {
      id: '1',
      kpiName: 'Patient Satisfaction Score',
      currentValue: 87.5,
      targetValue: 90,
      unit: '%',
      category: 'patient_satisfaction',
      comments: 'Improvement seen in discharge process',
      submissionDate: new Date(),
      status: 'draft',
    },
    {
      id: '2',
      kpiName: 'Average Wait Time',
      currentValue: 25,
      targetValue: 20,
      unit: 'minutes',
      category: 'operational_efficiency',
      submissionDate: new Date(),
      status: 'submitted',
    },
  ]);

  const [selectedEntry, setSelectedEntry] = useState<KPIEntry | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    kpiName: '',
    currentValue: '',
    targetValue: '',
    unit: '%',
    category: 'patient_satisfaction',
    comments: '',
  });

  const categories = [
    { value: 'patient_satisfaction', label: 'Patient Satisfaction' },
    { value: 'clinical_quality', label: 'Clinical Quality' },
    { value: 'operational_efficiency', label: 'Operational Efficiency' },
    { value: 'financial_performance', label: 'Financial Performance' },
    { value: 'staff_performance', label: 'Staff Performance' },
  ];

  const units = ['%', 'minutes', 'hours', 'days', 'count', 'score', '$', 'ratio'];

  const handleAddNew = () => {
    setFormData({
      kpiName: '',
      currentValue: '',
      targetValue: '',
      unit: '%',
      category: 'patient_satisfaction',
      comments: '',
    });
    setSelectedEntry(null);
    setIsEditing(false);
    setShowFormModal(true);
  };

  const handleEdit = (entry: KPIEntry) => {
    setFormData({
      kpiName: entry.kpiName,
      currentValue: entry.currentValue.toString(),
      targetValue: entry.targetValue.toString(),
      unit: entry.unit,
      category: entry.category,
      comments: entry.comments || '',
    });
    setSelectedEntry(entry);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleSave = () => {
    if (!formData.kpiName || !formData.currentValue || !formData.targetValue) {
      alert('Please fill in all required fields');
      return;
    }

    const newEntry: KPIEntry = {
      id: isEditing ? selectedEntry!.id : Date.now().toString(),
      kpiName: formData.kpiName,
      currentValue: parseFloat(formData.currentValue),
      targetValue: parseFloat(formData.targetValue),
      unit: formData.unit,
      category: formData.category,
      comments: formData.comments,
      submissionDate: new Date(),
      status: 'draft',
    };

    if (isEditing) {
      setKpiEntries(prev => prev.map(entry => 
        entry.id === selectedEntry!.id ? newEntry : entry
      ));
    } else {
      setKpiEntries(prev => [...prev, newEntry]);
    }

    setShowFormModal(false);
    alert(isEditing ? 'KPI updated successfully' : 'New KPI added successfully');
  };

  const handleDelete = (id: string) => {
    setEntryToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      setKpiEntries(prev => prev.filter(entry => entry.id !== entryToDelete));
      setShowDeleteModal(false);
      setEntryToDelete(null);
      alert('KPI deleted successfully');
    }
  };

  const handleSubmit = (id: string) => {
    setKpiEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, status: 'submitted' } : entry
    ));
    alert('KPI submitted for review');
  };

  const handleSubmitAll = () => {
    const draftEntries = kpiEntries.filter(entry => entry.status === 'draft');
    if (draftEntries.length === 0) {
      alert('No draft KPIs to submit');
      return;
    }
    
    setKpiEntries(prev => prev.map(entry => 
      entry.status === 'draft' ? { ...entry, status: 'submitted' } : entry
    ));
    alert(`${draftEntries.length} KPIs submitted for review`);
  };

  const getStatusIcon = (status: KPIEntry['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'submitted':
        return <Upload className="h-4 w-4 text-blue-500" />;
      default:
        return <ClipboardList className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: KPIEntry['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceIndicator = (current: number, target: number, unit: string) => {
    const isHigherBetter = !unit.includes('time') && !unit.includes('wait');
    const isOnTarget = isHigherBetter ? current >= target : current <= target;
    const percentage = ((current / target) * 100).toFixed(1);

    return (
      <div className={cn(
        'flex items-center space-x-2',
        isOnTarget ? 'text-green-600' : 'text-red-600'
      )}>
        {isOnTarget ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">{percentage}% of target</span>
      </div>
    );
  };

  const draftCount = kpiEntries.filter(entry => entry.status === 'draft').length;
  const submittedCount = kpiEntries.filter(entry => entry.status === 'submitted').length;

  return (
    <>
      <DashboardLayout title="KPI Submission">
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Draft KPIs</p>
                    <p className="text-2xl font-bold text-yellow-600">{draftCount}</p>
                  </div>
                  <ClipboardList className="h-6 w-6 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Submitted</p>
                    <p className="text-2xl font-bold text-blue-600">{submittedCount}</p>
                  </div>
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-green-600">{kpiEntries.length}</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <Button 
                variant="premium" 
                icon={<Plus className="h-4 w-4" />}
                onClick={handleAddNew}
              >
                Add New KPI
              </Button>
              {draftCount > 0 && (
                <Button 
                  variant="success" 
                  icon={<Upload className="h-4 w-4" />}
                  onClick={handleSubmitAll}
                >
                  Submit All Drafts ({draftCount})
                </Button>
              )}
            </div>
          </div>

          {/* KPI Entries */}
          <div className="space-y-4">
            {kpiEntries.map((entry) => (
              <Card key={entry.id} className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {entry.kpiName}
                        </h3>
                        <div className={cn(
                          'inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border',
                          getStatusColor(entry.status)
                        )}>
                          {getStatusIcon(entry.status)}
                          <span className="capitalize">{entry.status}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs font-medium text-gray-500 mb-1">Current Value</div>
                          <div className="text-lg font-bold text-gray-900">
                            {entry.currentValue}{entry.unit}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs font-medium text-gray-500 mb-1">Target</div>
                          <div className="text-lg font-bold text-blue-600">
                            {entry.targetValue}{entry.unit}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs font-medium text-gray-500 mb-1">Performance</div>
                          {getPerformanceIndicator(entry.currentValue, entry.targetValue, entry.unit)}
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs font-medium text-gray-500 mb-1">Category</div>
                          <div className="text-sm font-medium capitalize text-gray-900">
                            {entry.category.replace('_', ' ')}
                          </div>
                        </div>
                      </div>

                      {entry.comments && (
                        <div className="mb-3">
                          <div className="text-sm font-medium text-gray-500 mb-1">Comments</div>
                          <p className="text-sm text-gray-700">{entry.comments}</p>
                        </div>
                      )}

                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Last updated: {entry.submissionDate.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => alert(`Viewing details for ${entry.kpiName}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {entry.status === 'draft' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={<Eye className="h-4 w-4" />}
                            onClick={() => handleEdit(entry)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="success"
                            icon={<CheckCircle className="h-4 w-4" />}
                            onClick={() => handleSubmit(entry.id)}
                          >
                            Submit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => handleDelete(entry.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {kpiEntries.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <ClipboardList className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No KPIs submitted yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by adding your first KPI entry for this reporting period.
                </p>
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First KPI
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>

      {/* KPI Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={isEditing ? 'Edit KPI Entry' : 'Add New KPI Entry'}
        description="Enter the KPI details for this reporting period"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="kpiName">KPI Name *</Label>
              <Input
                id="kpiName"
                value={formData.kpiName}
                onChange={(e) => setFormData(prev => ({ ...prev, kpiName: e.target.value }))}
                placeholder="e.g., Patient Satisfaction Score"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="currentValue">Current Value *</Label>
              <Input
                id="currentValue"
                type="number"
                step="0.1"
                value={formData.currentValue}
                onChange={(e) => setFormData(prev => ({ ...prev, currentValue: e.target.value }))}
                placeholder="Enter current value"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="targetValue">Target Value *</Label>
              <Input
                id="targetValue"
                type="number"
                step="0.1"
                value={formData.targetValue}
                onChange={(e) => setFormData(prev => ({ ...prev, targetValue: e.target.value }))}
                placeholder="Enter target value"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="unit">Unit</Label>
              <select
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="comments">Comments (Optional)</Label>
            <textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Add any additional context or notes..."
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowFormModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update KPI' : 'Save KPI'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete KPI Entry"
        description="Are you sure you want to delete this KPI entry? This action cannot be undone."
        variant="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

export default withAuth(ManagerKPIFormPage, { requiredRole: 'manager' });