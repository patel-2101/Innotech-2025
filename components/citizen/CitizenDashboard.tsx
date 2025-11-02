'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  location?: string;
}

export default function CitizenDashboard() {
  const { user, firebaseUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    if (!firebaseUser) return;

    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch('/api/complaints', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setComplaints(data.data.complaints);
      } else {
        setError('Failed to fetch complaints');
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
      case 'REJECTED': return 'bg-red-100 text-red-800';
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
        <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome, {user?.name || user?.phoneNumber}
        </p>
      </div>

      <div className="mb-6">
        <Link
          href="/citizen/complaints/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          + New Complaint
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {complaints.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No complaints yet. Create your first complaint!</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {complaints.map((complaint) => (
              <li key={complaint.id}>
                <Link href={`/citizen/complaints/${complaint.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {complaint.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {complaint.description.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="ml-4 shrink-0">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Category: {complaint.category}
                        </p>
                        {complaint.location && (
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            📍 {complaint.location}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
