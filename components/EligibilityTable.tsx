'use client';

import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

interface EligibilityTableProps {
  category: 'accepted' | 'notAccepted' | 'needsReview';
  title: string;
}

export default function EligibilityTable({ category, title }: EligibilityTableProps) {
  const { items, deleteItem } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(
    (item) =>
      item.category === category &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ghlContactId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {isAdmin && (
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all">
              <FiPlus className="w-4 h-4" />
              <span>New Item</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all">
            <FiFilter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                GHL Contact ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Appointment Status
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-gray-400">
                  No items found
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-white font-medium">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-300">{item.ghlContactId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-300">{item.reason}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.appointmentStatus === 'Scheduled'
                          ? 'bg-blue-500/20 text-blue-400'
                          : item.appointmentStatus === 'Completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {item.appointmentStatus}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-all">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
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
          Showing {filteredItems.length} of {items.filter(i => i.category === category).length} items
        </p>
      </div>
    </div>
  );
}
