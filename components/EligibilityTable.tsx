'use client';

import { useData } from '@/context/DataContext';
import { FiSearch, FiFilter, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

interface EligibilityTableProps {
  category: 'accepted' | 'notAccepted' | 'needsReview';
  title: string;
}

export default function EligibilityTable({ category, title }: EligibilityTableProps) {
  const { items, deleteItem } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [swipedRow, setSwipedRow] = useState<string | null>(null);

  const filteredItems = items.filter(
    (item) =>
      item.category === category &&
      ((item.result_data?.patient?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.result_data?.patient?.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contact_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.result_data?.reason || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.result_data?.payer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRowClick = (itemId: string) => {
    if (swipedRow === itemId) {
      setSwipedRow(null);
    } else {
      setSwipedRow(itemId);
    }
  };

  const closeSwipe = () => {
    setSwipedRow(null);
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
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

      <div className="overflow-x-auto overflow-visible" onClick={swipedRow ? closeSwipe : undefined}>
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Contact ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Payer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Checked At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No items found
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item._id}
                  className={`hover:bg-gray-700/50 transition-colors relative overflow-visible ${swipedRow === item._id ? 'bg-gray-700' : ''}`}
                  onClick={() => handleRowClick(item._id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-white font-medium">
                      {item.result_data?.patient?.first_name} {item.result_data?.patient?.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-300">{item.contact_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.result_data?.status === 'Eligible' || item.result_data?.status === 'Eligible'
                          ? 'bg-green-500/20 text-green-400'
                          : item.result_data?.status === 'Not Eligible' || item.result_data?.status === 'Not Accepted'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {item.result_data?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-300">{item.result_data?.payer?.name || item.result_data?.insurance_type || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-300">{item.result_data?.reason || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-300 text-sm">
                      {item.result_data?.checked_at ? new Date(item.result_data.checked_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  {/* Swipe action buttons - slide in from right */}
                  {swipedRow === item._id && (
                    <div
                      className="absolute inset-y-0 right-0 flex items-center gap-2 pr-6 pl-32 bg-gray-800/95 backdrop-blur-sm transition-all z-10"
                      onClick={(e) => e.stopPropagation()}
                      style={{ minWidth: '300px' }}
                    >
                      <button
                        onClick={() => {
                          closeSwipe();
                          // Edit functionality here
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all whitespace-nowrap"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          deleteItem(item._id);
                          closeSwipe();
                        }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all whitespace-nowrap"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                      <button
                        onClick={closeSwipe}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-all whitespace-nowrap"
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
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
