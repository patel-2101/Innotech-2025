'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowLeft, Loader2, LogIn } from 'lucide-react';

export default function OfficerLoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/officer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          password
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Set token in cookie
        document.cookie = `authToken=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        router.push('/officer');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link 
          href="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Officer Login</h1>
            <p className="text-gray-600">Access your officer dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                Office ID
              </label>
              <input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="OFF12345"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-800 font-medium mb-2">Demo Credentials:</p>
            <div className="text-xs text-purple-600 space-y-1">
              <p><span className="font-semibold">Office ID:</span> OFF12345</p>
              <p><span className="font-semibold">Password:</span> officer123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
