import type React from "react";

interface CommonCardViewProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  title?: string;

  // OPTIONAL PAGINATION PROPS
  withPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const CommonCardView = <T,>({
  data,
  renderItem,
  withPagination,
  currentPage,
  totalPages,
  onPageChange,
}: CommonCardViewProps<T>) => {

  console.log("CardView:", { withPagination, currentPage, totalPages, data });

  return (
    <div className="border border-blue-500 p-4 mt-10">
      <h1 className="text-red-500 text-lg">CARD VIEW TEST</h1>

      {data?.map((item, index) => (
        <div key={index} className="p-4 border bg-gray-100 my-2">
          {renderItem(item)}
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <button onClick={() => onPageChange?.(currentPage! - 1)}>Prev</button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={() => onPageChange?.(currentPage! + 1)}>Next</button>
      </div>
    </div>
  );
};
