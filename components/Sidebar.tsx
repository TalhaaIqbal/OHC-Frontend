'use client';

import { useRouter, usePathname } from 'next/navigation';
import { FiHome, FiMap, FiLogOut, FiSettings, FiGrid } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiGrid, label: 'Eligibility', path: '/dashboard/eligibility' },
    { icon: FiMap, label: 'States', path: '/dashboard/states' },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">OHC Portal</h1>
        <p className="text-gray-400 text-sm mt-1">Eligibility Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4 px-4 py-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name.charAt(0)}
          </div>
          <div>
            <p className="text-white font-medium text-sm">{user?.name}</p>
            <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
