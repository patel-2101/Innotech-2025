'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'ADMIN':
        return '/admin';
      case 'OFFICER':
        return '/officer';
      case 'WORKER':
        return '/worker';
      case 'CITIZEN':
        return '/citizen';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href={getDashboardLink()} className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Smart Complaint System</span>
            </Link>
            
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href={getDashboardLink()}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === getDashboardLink()
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
                
                {user.role === 'CITIZEN' && (
                  <Link
                    href="/citizen/complaints/new"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === '/citizen/complaints/new'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    New Complaint
                  </Link>
                )}
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">
                {user.name || user.phoneNumber} ({user.role})
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
