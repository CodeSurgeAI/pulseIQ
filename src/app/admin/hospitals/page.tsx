'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal, ConfirmModal } from '@/components/ui/modal';
import { withAuth } from '@/hooks/use-auth';
import { useAlert } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  MapPin,
  Phone,
  Users,
  Activity,
  CheckCircle,
  AlertCircle,
  Eye,
  Mail
} from 'lucide-react';
import { mockHospitals, mockUsers } from '@/utils/mock-data';
import { Hospital, User } from '@/types';

type HospitalFormData = {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  totalBeds: number;
  isActive: boolean;
};

function AdminHospitalsPage() {
  const { showAlert } = useAlert();
  const { showSuccess, showError } = useToast();
  
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [users] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<HospitalFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    totalBeds: 0,
    isActive: true
  });

  // Filter hospitals based on search and status
  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && hospital.isActive) ||
                         (selectedStatus === 'inactive' && !hospital.isActive);
    return matchesSearch && matchesStatus;
  });

  const getUserCountForHospital = (hospitalId: string) => {
    return users.filter(user => user.hospitalId === hospitalId).length;
  };

  // Form handling functions
  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
      website: '',
      totalBeds: 0,
      isActive: true
    });
  };

  const handleInputChange = (field: keyof HospitalFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // CRUD Operations
  const handleAddHospital = () => {
    if (!formData.name || !formData.address || !formData.phone || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    const newHospital: Hospital = {
      id: `hospital_${Date.now()}`,
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      totalBeds: formData.totalBeds,
      departments: [],
      isActive: formData.isActive,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setHospitals(prev => [...prev, newHospital]);
    setShowAddModal(false);
    resetForm();
    showSuccess('Hospital Created', 'Hospital created successfully!');
  };

  const handleEditHospital = () => {
    if (!selectedHospital || !formData.name || !formData.address || !formData.phone || !formData.email) {
      showAlert({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    setHospitals(prev => prev.map(hospital => 
      hospital.id === selectedHospital.id 
        ? {
            ...hospital,
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
            totalBeds: formData.totalBeds,
            isActive: formData.isActive,
            updatedAt: new Date()
          }
        : hospital
    ));

    setShowEditModal(false);
    setSelectedHospital(null);
    resetForm();
    showSuccess('Hospital Updated', 'Hospital updated successfully!');
  };

  const handleDeleteHospital = () => {
    if (!selectedHospital) return;

    setHospitals(prev => prev.filter(hospital => hospital.id !== selectedHospital.id));
    setShowDeleteConfirm(false);
    setSelectedHospital(null);
    showSuccess('Hospital Deleted', 'Hospital deleted successfully!');
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setFormData({
      name: hospital.name,
      address: hospital.address,
      city: hospital.city,
      state: hospital.state,
      zipCode: hospital.zipCode,
      phone: hospital.phone,
      email: hospital.email,
      website: hospital.website || '',
      totalBeds: hospital.totalBeds,
      isActive: hospital.isActive
    });
    setShowEditModal(true);
  };

  const openViewModal = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setShowViewModal(true);
  };

  const openDeleteConfirm = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setShowDeleteConfirm(true);
  };

  return (
    <DashboardLayout title="Hospital Management">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Hospital Management</h1>
          </div>
          <Button 
            onClick={openAddModal}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Hospital</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{hospitals.length}</p>
                  <p className="text-sm text-gray-500">Total Hospitals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {hospitals.filter(h => h.isActive).length}
                  </p>
                  <p className="text-sm text-gray-500">Active Hospitals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {hospitals.filter(h => !h.isActive).length}
                  </p>
                  <p className="text-sm text-gray-500">Inactive</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search hospitals by name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{hospital.name}</CardTitle>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    hospital.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {hospital.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="truncate">{hospital.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{hospital.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Activity className="h-4 w-4 mr-2" />
                    <span>{hospital.totalBeds} Total Beds</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{getUserCountForHospital(hospital.id)} Users</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      icon={<Edit className="h-3 w-3" />}
                      onClick={() => openEditModal(hospital)}
                      title="Edit Hospital"
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      icon={<Trash2 className="h-3 w-3" />}
                      onClick={() => openDeleteConfirm(hospital)}
                      title="Delete Hospital"
                    >
                      Delete
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    variant="info"
                    icon={<Eye className="h-4 w-4" />}
                    onClick={() => openViewModal(hospital)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredHospitals.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hospitals found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first hospital.'}
              </p>
              {(!searchTerm && selectedStatus === 'all') && (
                <Button className="mt-4" onClick={openAddModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hospital
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Add Hospital Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Hospital"
          description="Register a new hospital in the system"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Hospital Name *</Label>
                <Input 
                  id="add-name" 
                  placeholder="Enter hospital name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-email">Email Address *</Label>
                <Input 
                  id="add-email" 
                  type="email" 
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-address">Address *</Label>
              <Input 
                id="add-address" 
                placeholder="Enter hospital address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-city">City</Label>
                <Input 
                  id="add-city" 
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-state">State</Label>
                <Input 
                  id="add-state" 
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-zip">Zip Code</Label>
                <Input 
                  id="add-zip" 
                  placeholder="Enter zip code"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-phone">Phone Number *</Label>
                <Input 
                  id="add-phone" 
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-website">Website</Label>
                <Input 
                  id="add-website" 
                  placeholder="Enter website URL"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-beds">Total Beds</Label>
                <Input 
                  id="add-beds" 
                  type="number" 
                  placeholder="Enter total beds"
                  value={formData.totalBeds}
                  onChange={(e) => handleInputChange('totalBeds', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="add-active"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <Label htmlFor="add-active">Hospital is active</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddHospital}>Create Hospital</Button>
            </div>
          </div>
        </Modal>

        {/* Edit Hospital Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Hospital"
          description="Update hospital information"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Hospital Name *</Label>
                <Input 
                  id="edit-name" 
                  placeholder="Enter hospital name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address *</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Address *</Label>
              <Input 
                id="edit-address" 
                placeholder="Enter hospital address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input 
                  id="edit-city" 
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-state">State</Label>
                <Input 
                  id="edit-state" 
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-zip">Zip Code</Label>
                <Input 
                  id="edit-zip" 
                  placeholder="Enter zip code"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number *</Label>
                <Input 
                  id="edit-phone" 
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-website">Website</Label>
                <Input 
                  id="edit-website" 
                  placeholder="Enter website URL"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-beds">Total Beds</Label>
                <Input 
                  id="edit-beds" 
                  type="number" 
                  placeholder="Enter total beds"
                  value={formData.totalBeds}
                  onChange={(e) => handleInputChange('totalBeds', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-active"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <Label htmlFor="edit-active">Hospital is active</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditHospital}>Update Hospital</Button>
            </div>
          </div>
        </Modal>

        {/* View Hospital Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Hospital Details"
          description="View detailed hospital information"
          size="lg"
        >
          {selectedHospital && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedHospital.name}</h3>
                  <p className="text-gray-500">{selectedHospital.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Contact Information</Label>
                    <div className="mt-1 space-y-2">
                      <div className="flex items-center text-sm text-gray-900">
                        <Phone className="h-4 w-4 mr-2" />
                        {selectedHospital.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="h-4 w-4 mr-2" />
                        {selectedHospital.email}
                      </div>
                      {selectedHospital.website && (
                        <div className="flex items-center text-sm text-gray-900">
                          <span className="mr-2">🌐</span>
                          <a href={selectedHospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedHospital.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Location</Label>
                    <div className="mt-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 mr-2" />
                        <div>
                          <p>{selectedHospital.address}</p>
                          <p>{selectedHospital.city}, {selectedHospital.state} {selectedHospital.zipCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Capacity & Status</Label>
                    <div className="mt-1 space-y-2">
                      <div className="flex items-center text-sm text-gray-900">
                        <Activity className="h-4 w-4 mr-2" />
                        <span>{selectedHospital.totalBeds} Total Beds</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{getUserCountForHospital(selectedHospital.id)} Staff Members</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                          selectedHospital.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedHospital.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">System Information</Label>
                    <div className="mt-1 space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Hospital ID</p>
                        <p className="text-sm text-gray-900 font-mono">{selectedHospital.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedHospital.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Updated</p>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedHospital.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedHospital);
                }}>
                  Edit Hospital
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteHospital}
          title="Delete Hospital"
          description={`Are you sure you want to delete ${selectedHospital?.name}? This action cannot be undone and will affect all associated staff members.`}
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </DashboardLayout>
  );
}

export default withAuth(AdminHospitalsPage, { requiredRole: 'admin' });