import { format } from "date-fns";

interface Column<T> {
  label: string;
  accessor: string;
  render?:(item:T)=> React.ReactNode
}

interface CommonTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  rowsPerPages?: number;
  withPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const CommonTableView = <T,>({
  data,
  columns,
  title,
  withPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,

}: CommonTableProps<T>) => {
  return (
    <div className="hidden md:block overflow-x-auto rounded-lg shadow">
      <div className="p-4 border-b bg-gray-100 text-xl font-semibold text-gray-700">
        {title && (
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
            {title}
          </h2>
        )}
      </div>
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data?.map((item, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"
              }
            >
              {columns.map((col) => {
                const rawValue = item[col?.accessor];
                const isDate =
                  col.accessor.toLowerCase().includes("date") ||
                  col.accessor.toLowerCase().includes("created");

                return (
                  <td
                    key={col.accessor}
                    className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                  >
                    {col.render
                      ? col.render(item)
                      : isDate && rawValue
                      ? format(new Date(rawValue), "dd MMM yyyy")
                      : rawValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

     {withPagination && (
  <div className="flex justify-end gap-2 mt-4">
    <button
      disabled={currentPage === 1}
      onClick={() => onPageChange && onPageChange(currentPage - 1)}
    >
      Previous
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button
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
