'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiMap } from 'react-icons/fi';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { getCategoryCount } = useData();

  const acceptedCount = getCategoryCount('accepted');
  const notAcceptedCount = getCategoryCount('notAccepted');
  const needsReviewCount = getCategoryCount('needsReview');

  const cards = [
    {
      title: 'Accepted',
      count: acceptedCount,
      icon: FiCheckCircle,
      color: 'from-green-600 to-green-700',
      borderColor: 'border-green-500',
      path: '/dashboard/eligibility/accepted',
    },
    {
      title: 'Not Accepted',
      count: notAcceptedCount,
      icon: FiXCircle,
      color: 'from-red-600 to-red-700',
      borderColor: 'border-red-500',
      path: '/dashboard/eligibility/not-accepted',
    },
    {
      title: 'Needs Review',
      count: needsReviewCount,
      icon: FiAlertCircle,
      color: 'from-yellow-600 to-yellow-700',
      borderColor: 'border-yellow-500',
      path: '/dashboard/eligibility/needs-review',
    },
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={() => router.push(card.path)}
                className={`relative overflow-hidden bg-gradient-to-br ${card.color} rounded-xl p-6 border-2 ${card.borderColor} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-white">{card.count}</p>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-white">{card.title}</h2>
                <p className="text-white/80 text-sm mt-1">Click to view details</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/dashboard/states')}
              className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiMap className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Manage States</p>
                <p className="text-gray-400 text-sm">View and edit state configurations</p>
              </div>
            </button>
            <button
              onClick={() => router.push('/dashboard/eligibility')}
              className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
            >
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">View All Eligibility</p>
                <p className="text-gray-400 text-sm">See all eligibility test results</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
