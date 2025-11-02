'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';

interface WorkProofUploadProps {
  complaintId: string;
  onSuccess?: () => void;
}

export default function WorkProofUpload({ complaintId, onSuccess }: WorkProofUploadProps) {
  const { firebaseUser } = useAuth();
  const [beforePhotos, setBeforePhotos] = useState<File[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleBeforePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBeforePhotos(Array.from(e.target.files));
    }
  };

  const handleAfterPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAfterPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // For production, upload files to Firebase Storage first
      // For now, we'll just submit empty arrays or placeholders
      
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch(`/api/complaints/${complaintId}/work-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          beforePhotos: beforePhotos.map(f => f.name), // In production, use uploaded URLs
          afterPhotos: afterPhotos.map(f => f.name), // In production, use uploaded URLs
          description,
        })
      });

      if (response.ok) {
        setSuccess(true);
        setBeforePhotos([]);
        setAfterPhotos([]);
        setDescription('');
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to upload work proof');
      }
    } catch (err) {
      setError('An error occurred while uploading work proof');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Work Proof</h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          Work proof uploaded successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="beforePhotos" className="block text-sm font-medium text-gray-700 mb-2">
            Before Photos
          </label>
          <input
            type="file"
            id="beforePhotos"
            multiple
            accept="image/*"
            onChange={handleBeforePhotosChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {beforePhotos.length > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              {beforePhotos.length} file(s) selected
            </p>
          )}
        </div>

        <div>
          <label htmlFor="afterPhotos" className="block text-sm font-medium text-gray-700 mb-2">
            After Photos (When work is completed)
          </label>
          <input
            type="file"
            id="afterPhotos"
            multiple
            accept="image/*"
            onChange={handleAfterPhotosChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {afterPhotos.length > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              {afterPhotos.length} file(s) selected
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="Describe the work done..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || (beforePhotos.length === 0 && afterPhotos.length === 0)}
          className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Work Proof'}
        </button>
      </form>
    </div>
  );
}
