'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';

interface Stats {
  totalComplaints: number;
  pendingComplaints: number;
  assignedComplaints: number;
  inProgressComplaints: number;
  completedComplaints: number;
  totalCitizens: number;
  totalWorkers: number;
  totalOfficers: number;
}

interface CategoryStats {
  category: string;
  count: number;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  citizen: {
    name: string | null;
    phoneNumber: string;
  };
}

export default function OfficerDashboard() {
  const { firebaseUser } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!firebaseUser) return;

    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data.stats);
        setCategoryStats(data.data.complaintsByCategory);
        setRecentComplaints(data.data.recentComplaints);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Officer Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of all complaints and system statistics
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="text-3xl">📋</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Complaints</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalComplaints}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="text-3xl">⏳</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-2xl font-semibold text-yellow-600">{stats.pendingComplaints}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="text-3xl">🔄</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                    <dd className="text-2xl font-semibold text-purple-600">{stats.inProgressComplaints}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="text-3xl">✅</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                    <dd className="text-2xl font-semibold text-green-600">{stats.completedComplaints}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Stats */}
      {stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-500">Citizens</h3>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.totalCitizens}</p>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-500">Workers</h3>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.totalWorkers}</p>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-500">Officers</h3>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.totalOfficers}</p>
          </div>
        </div>
      )}

      {/* Complaints by Category */}
      {categoryStats.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Complaints by Category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categoryStats.map((cat) => (
              <div key={cat.category} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{cat.category.replace('_', ' ')}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Complaints */}
      {recentComplaints.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Complaints</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Citizen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{complaint.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{complaint.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {complaint.citizen.name || complaint.citizen.phoneNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
