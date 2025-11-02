'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Settings,
  Menu,
  X,
  LogOut,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/citizen', icon: LayoutDashboard, roles: ['CITIZEN'] },
  { name: 'My Complaints', href: '/citizen/complaints', icon: FileText, roles: ['CITIZEN'] },
  
  { name: 'Dashboard', href: '/worker', icon: LayoutDashboard, roles: ['WORKER'] },
  { name: 'My Tasks', href: '/worker/tasks', icon: ClipboardList, roles: ['WORKER'] },
  
  { name: 'Dashboard', href: '/officer', icon: LayoutDashboard, roles: ['OFFICER'] },
  { name: 'Complaints', href: '/officer/complaints', icon: FileText, roles: ['OFFICER'] },
  { name: 'Workers', href: '/officer/workers', icon: Users, roles: ['OFFICER'] },
  
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['ADMIN'] },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['ADMIN'] },
  { name: 'Users', href: '/admin/users', icon: Users, roles: ['ADMIN'] },
  { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['ADMIN'] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Determine current role from pathname
  const currentRole = pathname?.split('/')[1]?.toUpperCase() || 'CITIZEN';
  
  // Filter navigation based on current role
  const filteredNav = navigation.filter(item => 
    item.roles.includes(currentRole)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">SmartCMS</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {currentRole[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentRole.charAt(0) + currentRole.slice(1).toLowerCase()} User
              </p>
              <p className="text-xs text-gray-500 truncate">{currentRole}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full mt-2 justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Mobile user menu */}
              <div className="lg:hidden">
                <button className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
