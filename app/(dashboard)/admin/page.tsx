'use client';

import { useState } from 'react';
import { 
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  Search,
  MoreVertical,
  UserPlus,
  Edit,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [showAddUser, setShowAddUser] = useState(false);

  // Mock data
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Complaints', value: '5,678', change: '+8%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Avg Resolution Time', value: '2.4 days', change: '-15%', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Resolution Rate', value: '94%', change: '+3%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  const categoryData = [
    { name: 'Water', complaints: 145, resolved: 120 },
    { name: 'Electricity', complaints: 98, resolved: 85 },
    { name: 'Road', complaints: 234, resolved: 210 },
    { name: 'Garbage', complaints: 87, resolved: 75 },
    { name: 'Others', complaints: 54, resolved: 48 },
  ];

  const statusData = [
    { name: 'Resolved', value: 538, color: '#10b981' },
    { name: 'In Progress', value: 145, color: '#f59e0b' },
    { name: 'Pending', value: 87, color: '#eab308' },
    { name: 'Rejected', value: 23, color: '#ef4444' },
  ];

  const users = [
    { id: 1, name: 'Priya Sharma', email: 'priya@example.com', role: 'CITIZEN', status: 'Active', complaints: 12, joinedAt: '2025-01-15' },
    { id: 2, name: 'Ravi Kumar', email: 'ravi@example.com', role: 'WORKER', status: 'Active', completed: 45, joinedAt: '2024-06-20' },
    { id: 3, name: 'Suresh Reddy', email: 'suresh@example.com', role: 'WORKER', status: 'Active', completed: 38, joinedAt: '2024-08-10' },
    { id: 4, name: 'Amit Patel', email: 'amit@example.com', role: 'OFFICER', status: 'Active', managed: 156, joinedAt: '2024-03-05' },
    { id: 5, name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'CITIZEN', status: 'Inactive', complaints: 3, joinedAt: '2025-09-01' },
  ];

  const recentActivity = [
    { id: 1, action: 'New complaint filed', user: 'Priya Sharma', time: '2 minutes ago', type: 'complaint' },
    { id: 2, action: 'Worker assigned', user: 'Amit Patel', time: '15 minutes ago', type: 'assignment' },
    { id: 3, action: 'Complaint resolved', user: 'Ravi Kumar', time: '1 hour ago', type: 'resolution' },
    { id: 4, action: 'New user registered', user: 'System', time: '2 hours ago', type: 'user' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">System overview and user management</p>
        </div>
        <Button onClick={() => setShowAddUser(true)}>
          <UserPlus className="w-5 h-5 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <div className={`${stat.bg} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <span className={`text-sm font-semibold ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Complaints by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="complaints" fill="#3b82f6" name="Total" />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              User Management
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search users..." className="pl-9" />
              </div>
              <Select className="sm:w-32">
                <option value="">All Roles</option>
                <option value="CITIZEN">Citizen</option>
                <option value="WORKER">Worker</option>
                <option value="OFFICER">Officer</option>
                <option value="ADMIN">Admin</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Activity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Joined</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={
                        user.role === 'ADMIN' ? 'default' :
                        user.role === 'OFFICER' ? 'secondary' :
                        'outline'
                      }>
                        {user.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.status === 'Active' ? 'success' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {user.role === 'CITIZEN' && `${user.complaints} complaints`}
                      {user.role === 'WORKER' && `${user.completed} completed`}
                      {user.role === 'OFFICER' && `${user.managed} managed`}
                      {user.role === 'ADMIN' && 'Full access'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {user.joinedAt}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'complaint' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'assignment' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'resolution' ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'complaint' && <TrendingUp className="w-5 h-5" />}
                  {activity.type === 'assignment' && <Users className="w-5 h-5" />}
                  {activity.type === 'resolution' && <CheckCircle2 className="w-5 h-5" />}
                  {activity.type === 'user' && <UserPlus className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with specific role and permissions
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input placeholder="Enter full name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input type="email" placeholder="user@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <Input type="tel" placeholder="+91 98765 43210" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <Select>
                <option value="">Select role</option>
                <option value="CITIZEN">Citizen</option>
                <option value="WORKER">Worker</option>
                <option value="OFFICER">Officer</option>
                <option value="ADMIN">Admin</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input placeholder="City, State" />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button"
                variant="outline" 
                className="flex-1"
                onClick={() => setShowAddUser(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
