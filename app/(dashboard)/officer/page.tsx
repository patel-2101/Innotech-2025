'use client';

import { useState } from 'react';
import { 
  Users,
  Search,
  Filter,
  UserPlus,
  MapPin,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getStatusColor, getPriorityColor, getCategoryIcon, formatDateTime } from '@/lib/utils';

export default function OfficerDashboard() {
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [showAssignWorker, setShowAssignWorker] = useState(false);

  // Mock data
  const stats = [
    { label: 'Total Complaints', value: '156', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending', value: '24', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'In Progress', value: '45', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Resolved', value: '87', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const complaints = [
    {
      id: 1,
      complaintId: 'CMP-1234',
      title: 'Street light not working',
      description: 'Street light near MG Road has been broken for 3 days',
      category: 'ELECTRICITY',
      status: 'PENDING',
      priority: 'MEDIUM',
      location: 'MG Road, Bangalore',
      createdAt: '2025-10-28T10:30:00Z',
      citizen: 'Priya Sharma',
      citizenPhone: '+91 98765 43210',
    },
    {
      id: 2,
      complaintId: 'CMP-1235',
      title: 'Water supply issue',
      description: 'No water supply since morning in JP Nagar area',
      category: 'WATER',
      status: 'ASSIGNED',
      priority: 'HIGH',
      location: 'JP Nagar, Bangalore',
      createdAt: '2025-10-30T14:20:00Z',
      citizen: 'Amit Patel',
      worker: 'Ravi Kumar',
      assignedAt: '2025-10-30T15:00:00Z',
    },
    {
      id: 3,
      complaintId: 'CMP-1230',
      title: 'Road pothole repair',
      description: 'Large pothole causing accidents near main junction',
      category: 'ROAD',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      location: 'Indiranagar, Bangalore',
      createdAt: '2025-10-29T09:15:00Z',
      citizen: 'Rajesh Kumar',
      worker: 'Suresh Reddy',
      assignedAt: '2025-10-29T10:00:00Z',
    },
  ];

  const workers = [
    { id: 1, name: 'Ravi Kumar', category: 'ELECTRICITY', activeTasks: 3, totalCompleted: 45 },
    { id: 2, name: 'Suresh Reddy', category: 'ROAD', activeTasks: 2, totalCompleted: 38 },
    { id: 3, name: 'Mohan Singh', category: 'WATER', activeTasks: 1, totalCompleted: 52 },
    { id: 4, name: 'Prakash Jain', category: 'GARBAGE', activeTasks: 0, totalCompleted: 29 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Officer Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor complaints and manage worker assignments</p>
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
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input placeholder="Search complaints..." className="pl-10" />
            </div>
            <Select className="lg:w-48">
              <option value="">All Categories</option>
              <option value="WATER">Water</option>
              <option value="ELECTRICITY">Electricity</option>
              <option value="ROAD">Road</option>
              <option value="GARBAGE">Garbage</option>
            </Select>
            <Select className="lg:w-48">
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </Select>
            <Select className="lg:w-48">
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">All Complaints</h2>
          <Badge variant="secondary">{complaints.length} complaints</Badge>
        </div>

        {complaints.map((complaint) => (
          <Card key={complaint.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-1">{getCategoryIcon(complaint.category)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500">{complaint.complaintId}</span>
                      </div>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{complaint.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">Filed: {formatDateTime(complaint.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div>
                      <p className="text-xs text-gray-600">Citizen</p>
                      <p className="text-sm font-medium text-gray-900">{complaint.citizen}</p>
                      <p className="text-xs text-gray-500">{complaint.citizenPhone}</p>
                    </div>
                    {complaint.worker && (
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Assigned Worker</p>
                        <p className="text-sm font-medium text-gray-900">{complaint.worker}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(complaint.assignedAt!)}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    View Details
                  </Button>
                  {complaint.status === 'PENDING' && (
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setShowAssignWorker(true);
                      }}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign Worker
                    </Button>
                  )}
                  {complaint.status === 'ASSIGNED' && (
                    <Button variant="secondary" size="sm">
                      Update Status
                    </Button>
                  )}
                  {complaint.status === 'IN_PROGRESS' && (
                    <Button variant="success" size="sm">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Workers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Available Workers</h2>
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            View All Workers
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workers.map((worker) => (
            <Card key={worker.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                    {worker.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{worker.name}</p>
                    <p className="text-xs text-gray-500">{worker.category}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Tasks:</span>
                    <span className="font-semibold text-gray-900">{worker.activeTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-semibold text-green-600">{worker.totalCompleted}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Assign Worker Dialog */}
      <Dialog open={showAssignWorker} onOpenChange={setShowAssignWorker}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Worker</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Worker
              </label>
              <Select className="w-full">
                <option value="">Choose a worker...</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name} - {worker.category} ({worker.activeTasks} active tasks)
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Deadline
              </label>
              <Input type="datetime-local" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <Select>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowAssignWorker(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1">
                Assign Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
