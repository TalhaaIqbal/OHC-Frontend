'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiArrowLeft } from 'react-icons/fi';

export default function StatesPage() {
  const router = useRouter();
  const { states, addState, updateState, deleteState, loading, error, refreshStates } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState<number | null>(null);
  const [formData, setFormData] = useState({ state: '', abbreviation: '', served: false, enrolled: false });

  const isAdmin = user?.role === 'admin';

  const filteredStates = states.filter(
    (state) =>
      state.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingState !== null) {
      await updateState(editingState, formData);
    } else {
      await addState(formData);
    }
    closeModal();
  };

  const openModal = (state?: typeof states[0], index?: number) => {
    if (state) {
      setEditingState(index || null);
      setFormData({
        state: state.state,
        abbreviation: state.abbreviation,
        served: state.served,
        enrolled: state.enrolled
      });
    } else {
      setEditingState(null);
      setFormData({ state: '', abbreviation: '', served: false, enrolled: false });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingState(null);
    setFormData({ state: '', abbreviation: '', served: false, enrolled: false });
  };

  const handleDelete = async (index: number) => {
    if (confirm('Are you sure you want to delete this state?')) {
      await deleteState(index);
    }
  };

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
              <h1 className="text-3xl font-bold text-white">States Management</h1>
              <p className="text-gray-400 mt-1">View and manage state configurations</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add State</span>
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="relative max-w-md flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={refreshStates}
              disabled={loading}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          {error && (
            <div className="mt-2 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    State Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Abbreviation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Served
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Enrolled
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStates.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-gray-400">
                      No states found
                    </td>
                  </tr>
                ) : (
                  filteredStates.map((state, index) => (
                    <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-white font-medium">{state.state}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-300">{state.abbreviation}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            state.served
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {state.served ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            state.enrolled
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {state.enrolled ? 'Yes' : 'No'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openModal(state, index)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-all"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(index)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-all"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-700 bg-gray-900">
            <p className="text-sm text-gray-400">
              Showing {filteredStates.length} of {states.length} states
            </p>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingState ? 'Edit State' : 'Add New State'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State Name
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., California"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Abbreviation
                  </label>
                  <input
                    type="text"
                    value={formData.abbreviation}
                    onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., CA"
                    required
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="served"
                    checked={formData.served}
                    onChange={(e) => setFormData({ ...formData, served: e.target.checked })}
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="served" className="text-sm font-medium text-gray-300">
                    Served
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enrolled"
                    checked={formData.enrolled}
                    onChange={(e) => setFormData({ ...formData, enrolled: e.target.checked })}
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="enrolled" className="text-sm font-medium text-gray-300">
                    Enrolled
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                  >
                    {editingState ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
