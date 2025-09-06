import { FC } from "react";
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const delta = 2; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    // Calculate range of page numbers to show
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    // Add pages to range
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add first page and dots if needed
    if (start > 1) {
      rangeWithDots.push(1);
      if (start > 2) {
        rangeWithDots.push("...");
      }
    }

    // Add main range
    rangeWithDots.push(...range);

    // Add dots and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = generatePageNumbers();

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage && !isLoading) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center mt-6">
      <div className="join">
        {/* Previous Button */}
        <button
          className={`join-item btn btn-sm ${
            currentPage === 1 || isLoading
              ? "btn-disabled"
              : "btn-ghost hover:btn-primary"
          }`}
          onClick={handlePrevious}
          disabled={currentPage === 1 || isLoading}
          title="Previous page"
        >
          <FaChevronLeft className="w-3 h-3" />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <button
                key={`dots-${index}`}
                className="join-item btn btn-sm btn-ghost cursor-default"
                disabled
              >
                <FaEllipsisH className="w-3 h-3" />
              </button>
            );
          }

          const isCurrentPage = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              className={`join-item btn btn-sm transition-all duration-200 ${
                isCurrentPage
                  ? "btn-primary"
                  : "btn-ghost hover:btn-primary hover:scale-105"
              } ${isLoading ? "btn-disabled" : ""}`}
              onClick={() => handlePageClick(pageNumber)}
              disabled={isLoading}
            >
              {isLoading && isCurrentPage ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                pageNumber
              )}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          className={`join-item btn btn-sm ${
            currentPage === totalPages || isLoading
              ? "btn-disabled"
              : "btn-ghost hover:btn-primary"
          }`}
          onClick={handleNext}
          disabled={currentPage === totalPages || isLoading}
          title="Next page"
        >
          <FaChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Page Info */}
      <div className="ml-4 text-sm text-base-content/60 hidden sm:block">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
