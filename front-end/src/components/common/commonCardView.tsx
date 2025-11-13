import type React from "react";

interface CommonCardViewProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  title?: string;

  // NEW OPTIONAL PAGINATION PROPS
  withPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const CommonCardView = <T,>({
  data,
  renderItem,
  title,
  withPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: CommonCardViewProps<T>) => {
  return (
    <div className="md:hidden space-y-4">
      {/* Title */}
      {title && (
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          {title}
        </h2>
      )}

      {/* Cards */}
      {data?.map((item, index) => (
        <div key={index} className="border rounded-xl p-4 shadow-sm bg-white">
          {renderItem(item)}
        </div>
      ))}

      {/* Pagination */}
      {withPagination && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
          >
            Prev
          </button>

          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
