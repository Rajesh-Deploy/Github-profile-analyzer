import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-1.5 py-4 select-none">
      {/* Prev Button */}
      <button
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2.5 rounded-xl bg-brandDark-900 border border-brandDark-800 text-brandDark-400 hover:text-white disabled:opacity-40 disabled:hover:text-brandDark-400 transition-all"
        aria-label="Previous Page"
      >
        <FaChevronLeft className="text-xs" />
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border ${
            page === pageNum
              ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105'
              : 'bg-brandDark-900 border-brandDark-800 text-brandDark-300 hover:text-white hover:border-brandDark-700'
          }`}
        >
          {pageNum}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2.5 rounded-xl bg-brandDark-900 border border-brandDark-800 text-brandDark-400 hover:text-white disabled:opacity-40 disabled:hover:text-brandDark-400 transition-all"
        aria-label="Next Page"
      >
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  );
};

export default Pagination;
