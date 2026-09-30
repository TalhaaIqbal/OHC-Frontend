'use client';

import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import EligibilityTable from '@/components/EligibilityTable';
import { FiArrowLeft } from 'react-icons/fi';

export default function NeedsReviewPage() {
  const router = useRouter();

  return (
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
          <h1 className="text-3xl font-bold text-white">Needs Review Items</h1>
          <p className="text-gray-400 mt-1">View and manage items that need review</p>
        </div>
        <EligibilityTable category="needsReview" title="Needs Review" />
      </div>
    </div>
  );
}
