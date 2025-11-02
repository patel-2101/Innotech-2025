'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

const CATEGORIES = [
  'ROAD',
  'WATER',
  'GARBAGE',
  'ELECTRICITY',
  'DRAINAGE',
  'STREET_LIGHT',
  'OTHER'
];

export default function ComplaintForm() {
  const { firebaseUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    latitude: '',
    longitude: '',
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [uploadedMediaUrls, setUploadedMediaUrls] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files));
    }
  };

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Failed to get location. Please enter manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;

    setError('');
    setLoading(true);

    try {
      // For production, upload files to Firebase Storage first
      // For now, we'll just submit the form data
      
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category || undefined,
          location: formData.location || undefined,
          latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
          longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
          mediaUrls: uploadedMediaUrls,
        })
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/citizen/complaints/${data.data.id}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create complaint');
      }
    } catch (err) {
      setError('An error occurred while creating the complaint');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Complaint</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill out the form below to submit a new complaint
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="Brief description of the issue"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="Detailed description of the complaint"
          />
          <p className="mt-1 text-xs text-gray-500">
            AI will automatically categorize your complaint based on the description
          </p>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category (Optional)
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          >
            <option value="">Auto-detect from description</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="flex-1 rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              placeholder="Address or location description"
            />
            <button
              type="button"
              onClick={handleGetLocation}
              className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm"
            >
              📍 Get Current
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              placeholder="Auto-filled"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              placeholder="Auto-filled"
            />
          </div>
        </div>

        <div>
          <label htmlFor="media" className="block text-sm font-medium text-gray-700">
            Photos/Videos
          </label>
          <input
            type="file"
            id="media"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {mediaFiles.length > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              {mediaFiles.length} file(s) selected
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
}
