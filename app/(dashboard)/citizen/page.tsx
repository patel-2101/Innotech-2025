'use client';

import { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  Image as ImageIcon, 
  Video,
  Upload,
  Search,
  Filter,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getStatusColor, getPriorityColor, getCategoryIcon, formatDateTime } from '@/lib/utils';

export default function CitizenDashboard() {
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  // Mock data
  const stats = [
    { label: 'Total Complaints', value: '12', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending', value: '3', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Resolved', value: '8', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Rejected', value: '1', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const complaints = [
    {
      id: 1,
      title: 'Street light not working',
      description: 'Street light near my house has been broken for 3 days',
      category: 'ELECTRICITY',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      location: 'MG Road, Bangalore',
      createdAt: '2025-10-28T10:30:00Z',
      worker: 'Ravi Kumar',
      hasMedia: true,
    },
    {
      id: 2,
      title: 'Water supply issue',
      description: 'No water supply since morning',
      category: 'WATER',
      status: 'ASSIGNED',
      priority: 'HIGH',
      location: 'JP Nagar, Bangalore',
      createdAt: '2025-10-30T14:20:00Z',
      hasMedia: false,
    },
    {
      id: 3,
      title: 'Road pothole',
      description: 'Large pothole causing accidents',
      category: 'ROAD',
      status: 'RESOLVED',
      priority: 'URGENT',
      location: 'Indiranagar, Bangalore',
      createdAt: '2025-10-25T09:15:00Z',
      resolvedAt: '2025-10-27T16:30:00Z',
      hasMedia: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Track and manage your complaints</p>
        </div>
        <Button onClick={() => setShowNewComplaint(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          File New Complaint
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input placeholder="Search complaints..." className="pl-10" />
            </div>
            <Select className="sm:w-48">
              <option value="">All Categories</option>
              <option value="WATER">Water</option>
              <option value="ELECTRICITY">Electricity</option>
              <option value="ROAD">Road</option>
              <option value="GARBAGE">Garbage</option>
            </Select>
            <Select className="sm:w-48">
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">My Complaints</h2>
        {complaints.map((complaint) => (
          <Card 
            key={complaint.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedComplaint(complaint)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-1">{getCategoryIcon(complaint.category)}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                      <p className="text-gray-600 mt-1">{complaint.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(complaint.priority)}>
                      {complaint.priority}
                    </Badge>
                    <Badge variant="outline">{complaint.category}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {complaint.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateTime(complaint.createdAt)}
                    </div>
                    {complaint.hasMedia && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <ImageIcon className="w-4 h-4" />
                        Has Attachments
                      </div>
                    )}
                  </div>

                  {complaint.worker && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                        {complaint.worker[0]}
                      </div>
                      <span className="text-gray-700">Assigned to <strong>{complaint.worker}</strong></span>
                    </div>
                  )}
                </div>

                <div className="lg:text-right">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Complaint Dialog */}
      <Dialog open={showNewComplaint} onOpenChange={setShowNewComplaint}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>File New Complaint</DialogTitle>
            <DialogDescription>
              Describe your issue and we'll assign it to the right team
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complaint Title *
              </label>
              <Input placeholder="Brief title of your complaint" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <Textarea 
                placeholder="Describe your complaint in detail..." 
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <Select>
                  <option value="">Select category</option>
                  <option value="WATER">💧 Water Supply</option>
                  <option value="ELECTRICITY">⚡ Electricity</option>
                  <option value="ROAD">🛣️ Road & Infrastructure</option>
                  <option value="GARBAGE">🗑️ Garbage Collection</option>
                  <option value="OTHERS">📋 Others</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <Select>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input placeholder="Enter address or use current location" className="pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photos/Videos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex gap-2">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, MP4 up to 10MB
                    </p>
                  </div>
                </div>
                <input type="file" className="hidden" accept="image/*,video/*" multiple />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNewComplaint(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit Complaint
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-2xl">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(selectedComplaint.category)}</span>
                  {selectedComplaint.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(selectedComplaint.status)}>
                    {selectedComplaint.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPriorityColor(selectedComplaint.priority)}>
                    {selectedComplaint.priority}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedComplaint.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="text-gray-900 font-medium">{selectedComplaint.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Filed On</p>
                    <p className="text-gray-900 font-medium">{formatDateTime(selectedComplaint.createdAt)}</p>
                  </div>
                  {selectedComplaint.worker && (
                    <div>
                      <p className="text-gray-500">Assigned Worker</p>
                      <p className="text-gray-900 font-medium">{selectedComplaint.worker}</p>
                    </div>
                  )}
                  {selectedComplaint.resolvedAt && (
                    <div>
                      <p className="text-gray-500">Resolved On</p>
                      <p className="text-gray-900 font-medium">{formatDateTime(selectedComplaint.resolvedAt)}</p>
                    </div>
                  )}
                </div>

                {selectedComplaint.hasMedia && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Attachments</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedComplaint(null)}>
                    Close
                  </Button>
                  {selectedComplaint.status !== 'RESOLVED' && (
                    <Button variant="destructive" className="flex-1">
                      Cancel Complaint
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
