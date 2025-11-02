'use client';

import { useState } from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle2,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Video,
  Upload,
  Camera,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getStatusColor, getPriorityColor, getCategoryIcon, formatDateTime } from '@/lib/utils';

export default function WorkerDashboard() {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showProofUpload, setShowProofUpload] = useState(false);

  // Mock data
  const stats = [
    { label: 'Assigned Tasks', value: '5', icon: ClipboardCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'In Progress', value: '2', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Completed', value: '23', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const tasks = [
    {
      id: 1,
      complaintId: 'CMP-1234',
      title: 'Street light not working',
      description: 'Street light near MG Road has been broken for 3 days',
      category: 'ELECTRICITY',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      location: 'MG Road, Bangalore',
      assignedAt: '2025-10-28T10:30:00Z',
      deadline: '2025-11-02T18:00:00Z',
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
      assignedAt: '2025-10-30T14:20:00Z',
      deadline: '2025-11-01T12:00:00Z',
      citizen: 'Amit Patel',
      citizenPhone: '+91 98765 43211',
    },
    {
      id: 3,
      complaintId: 'CMP-1230',
      title: 'Road pothole repair',
      description: 'Large pothole causing accidents near main junction',
      category: 'ROAD',
      status: 'ASSIGNED',
      priority: 'URGENT',
      location: 'Indiranagar, Bangalore',
      assignedAt: '2025-10-29T09:15:00Z',
      deadline: '2025-11-01T10:00:00Z',
      citizen: 'Rajesh Kumar',
      citizenPhone: '+91 98765 43212',
    },
  ];

  const completedTasks = [
    {
      id: 4,
      complaintId: 'CMP-1225',
      title: 'Garbage collection',
      category: 'GARBAGE',
      status: 'RESOLVED',
      location: 'Koramangala, Bangalore',
      completedAt: '2025-10-27T16:30:00Z',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Worker Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your assigned tasks and upload completion proof</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Active Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Active Tasks</h2>
          <Badge variant="secondary">{tasks.length} tasks</Badge>
        </div>
        
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-1">{getCategoryIcon(task.category)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500">{task.complaintId}</span>
                        {task.status === 'IN_PROGRESS' && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            In Progress
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge variant="outline">{task.category}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{task.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">Deadline: {formatDateTime(task.deadline)}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-900">Citizen Details</p>
                    <p className="text-sm text-blue-800 mt-1">{task.citizen} • {task.citizenPhone}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {task.status === 'ASSIGNED' && (
                    <Button onClick={() => setSelectedTask(task)}>
                      Start Task
                    </Button>
                  )}
                  {task.status === 'IN_PROGRESS' && (
                    <>
                      <Button onClick={() => {
                        setSelectedTask(task);
                        setShowProofUpload(true);
                      }}>
                        Upload Proof
                      </Button>
                      <Button variant="outline" size="sm">
                        Update Status
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recently Completed */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recently Completed</h2>
        {completedTasks.map((task) => (
          <Card key={task.id} className="border-green-200 bg-green-50/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-500">{task.complaintId}</span>
                      <span className="font-medium text-gray-900">{task.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{task.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-sm font-medium text-gray-900">{formatDateTime(task.completedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Proof Dialog */}
      <Dialog open={showProofUpload} onOpenChange={setShowProofUpload}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Work Proof</DialogTitle>
            <DialogDescription>
              Upload before and after photos/videos to complete the task
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-6 mt-4">
            {/* Before Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Before Work Photos *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Camera className="w-10 h-10 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Upload Before Photos
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Take photos before starting work
                    </p>
                  </div>
                  <Button type="button" size="sm" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
                <input type="file" className="hidden" accept="image/*,video/*" multiple />
              </div>
            </div>

            {/* After Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                After Work Photos *
              </label>
              <div className="border-2 border-dashed border-green-300 rounded-lg p-6 hover:border-green-400 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2 text-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Upload After Photos
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Take photos after completing work
                    </p>
                  </div>
                  <Button type="button" size="sm" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
                <input type="file" className="hidden" accept="image/*,video/*" multiple />
              </div>
            </div>

            {/* Work Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Notes
              </label>
              <Textarea 
                placeholder="Add any notes about the work completed..."
                rows={3}
              />
            </div>

            {/* Preview Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Uploaded Files</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-2">Before (0 files)</p>
                  <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-2">After (0 files)</p>
                  <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowProofUpload(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" variant="success">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Task
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
