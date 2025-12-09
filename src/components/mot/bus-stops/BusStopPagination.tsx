'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface BusStopPaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  loading: boolean;
}

export function BusStopPagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading,
}: BusStopPaginationProps) {
  const pageSizeOptions = [5, 10, 25, 50, 100];

  const startRecord = currentPage * pageSize + 1;
  const endRecord = Math.min((currentPage + 1) * pageSize, totalElements);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(
        0,
        Math.min(currentPage - 2, totalPages - maxVisiblePages)
      );
      const end = Math.min(totalPages, start + maxVisiblePages);

      for (let i = start; i < end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages && page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (!loading) {
      onPageSizeChange(size);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Records Info */}
        <div className="flex items-center text-sm text-gray-500">
          <span>
            Showing {startRecord.toLocaleString()} to{' '}
            {endRecord.toLocaleString()} of {totalElements.toLocaleString()}{' '}
            results
          </span>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <label htmlFor="pageSize" className="text-sm text-gray-500">
              Show:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              disabled={loading}
              className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Buttons - Only show if more than 1 page */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-1">
              {/* First Page */}
              <button
                onClick={() => handlePageChange(0)}
                disabled={currentPage === 0 || loading}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="First page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || loading}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                    className={`
                    px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  >
                    {page + 1}
                  </button>
                ))}
              </div>

              {/* Next Page */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1 || loading}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={currentPage === totalPages - 1 || loading}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Last page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="px-6 py-2 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-blue-700">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}
