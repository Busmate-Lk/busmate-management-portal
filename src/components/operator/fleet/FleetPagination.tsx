'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FleetPaginationProps {
  currentPage: number;     // 0-indexed
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZES = [5, 10, 20, 50];

export function FleetPagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: FleetPaginationProps) {
  if (totalPages <= 1 && totalElements <= Math.min(...PAGE_SIZES)) return null;

  const from = currentPage * pageSize + 1;
  const to   = Math.min((currentPage + 1) * pageSize, totalElements);

  const pages = () => {
    const arr: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) arr.push(i);
    } else {
      arr.push(0);
      if (currentPage > 2) arr.push('...');
      for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) arr.push(i);
      if (currentPage < totalPages - 3) arr.push('...');
      arr.push(totalPages - 1);
    }
    return arr;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Info + page size */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          {from}–{to} of {totalElements} bus{totalElements !== 1 ? 'es' : ''}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">Per page:</span>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-1.5 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-1.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`w-8 h-8 text-sm rounded border transition-colors ${
                p === currentPage
                  ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {(p as number) + 1}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-1.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
