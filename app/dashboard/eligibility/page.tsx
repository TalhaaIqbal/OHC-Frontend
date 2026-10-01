'use client';

import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import EligibilityTable from '@/components/EligibilityTable';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { useData } from '@/context/DataContext';

export default function EligibilityPage() {
  const router = useRouter();
  const { refreshEligibility, loading } = useData();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="mb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">All Eligibility Results</h1>
                <p className="text-gray-400 mt-1">View all eligibility test results across all categories</p>
              </div>
              <button
                onClick={refreshEligibility}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <EligibilityTable category="accepted" title="Accepted" />
            <EligibilityTable category="notAccepted" title="Not Accepted" />
            <EligibilityTable category="needsReview" title="Needs Review" />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
