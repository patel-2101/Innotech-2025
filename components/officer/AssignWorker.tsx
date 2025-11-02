'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';

interface User {
  id: string;
  name: string | null;
  phoneNumber: string;
}

interface AssignWorkerProps {
  complaintId: string;
  currentStatus: string;
  onSuccess?: () => void;
}

export default function AssignWorker({ complaintId, currentStatus, onSuccess }: AssignWorkerProps) {
  const { firebaseUser } = useAuth();
  const [workers, setWorkers] = useState<User[]>([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    if (!firebaseUser) return;

    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch('/api/users?role=WORKER', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWorkers(data.data.users);
      } else {
        setError('Failed to fetch workers');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setLoadingWorkers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !selectedWorker) return;

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch(`/api/complaints/${complaintId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          workerId: selectedWorker,
          deadline: deadline || undefined,
          notes: notes || undefined,
        })
      });

      if (response.ok) {
        setSuccess(true);
        setSelectedWorker('');
        setDeadline('');
        setNotes('');
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to assign worker');
      }
    } catch (err) {
      setError('An error occurred while assigning worker');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === 'COMPLETED') {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
        This complaint has been completed.
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Assign Worker</h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          Worker assigned successfully!
        </div>
      )}

      {loadingWorkers ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="worker" className="block text-sm font-medium text-gray-700 mb-2">
              Select Worker *
            </label>
            <select
              id="worker"
              required
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">-- Select a worker --</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name || worker.phoneNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
              Deadline (Optional)
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              placeholder="Additional instructions for the worker..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedWorker}
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Assigning...' : 'Assign Worker'}
          </button>
        </form>
      )}
    </div>
  );
}
