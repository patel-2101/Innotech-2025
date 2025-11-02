'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

interface Assignment {
  id: string;
  assignedAt: string;
  deadline?: string;
  notes?: string;
  complaint: {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    location?: string;
    mediaUrls: string[];
  };
  officer: {
    name: string | null;
  };
}

export default function WorkerDashboard() {
  const { firebaseUser } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    if (!firebaseUser) return;

    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch('/api/complaints?', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const complaints = data.data.complaints;
        
        // Extract assignments from complaints
        const allAssignments: Assignment[] = [];
        complaints.forEach((complaint: any) => {
          if (complaint.assignments && complaint.assignments.length > 0) {
            complaint.assignments.forEach((assignment: any) => {
              allAssignments.push({
                ...assignment,
                complaint: {
                  id: complaint.id,
                  title: complaint.title,
                  description: complaint.description,
                  category: complaint.category,
                  status: complaint.status,
                  location: complaint.location,
                  mediaUrls: complaint.mediaUrls,
                }
              });
            });
          }
        });
        
        setAssignments(allAssignments);
      } else {
        setError('Failed to fetch assignments');
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
        <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and manage your assigned complaints
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {assignments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No assignments yet. Check back later!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.complaint.status)}`}>
                    {assignment.complaint.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {assignment.complaint.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {assignment.complaint.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {assignment.complaint.description}
                </p>

                {assignment.complaint.location && (
                  <p className="text-sm text-gray-500 mb-2">
                    📍 {assignment.complaint.location}
                  </p>
                )}

                {assignment.deadline && (
                  <p className="text-sm text-gray-500 mb-2">
                    ⏰ Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                  </p>
                )}

                {assignment.notes && (
                  <p className="text-sm text-gray-600 mb-4 italic">
                    Note: {assignment.notes}
                  </p>
                )}

                <div className="text-xs text-gray-500 mb-4">
                  Assigned by: {assignment.officer.name || 'Officer'}
                </div>

                <Link
                  href={`/worker/complaints/${assignment.complaint.id}`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
