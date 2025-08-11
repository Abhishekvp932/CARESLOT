import React from "react";
import { Button } from "@/components/ui/button";
interface IPagination {
    currentPage:number;
    totalPages:number;
    onPageChange:(page:number)=> void;
}
export default function Pagination({ currentPage, totalPages, onPageChange }:IPagination) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        margin: "20px 0",
      }}
    >
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: "8px 12px",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}
      >
        Previous
      </Button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: "8px 12px",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}
      >
        Next
      </Button  >
    </div>
  );
}
