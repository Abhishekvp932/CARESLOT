"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useGetContactsDataQuery } from "@/features/admin/adminApi";

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data, isFetching, isError } = useGetContactsDataQuery({
    page: currentPage,
    limit,
    search: debouncedSearch,
  });

  const messages = Array.isArray(data?.data) ? data!.data : [];
  const totalPages = Number(data?.totalPages ?? 1);
  const totalItems = Number(
    data?.totalItems ?? data?.totalItem ?? data?.totalDocs ?? 0
  );

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const handlePreviousPage = () => canPrev && setCurrentPage((p) => p - 1);
  const handleNextPage = () => canNext && setCurrentPage((p) => p + 1);
  const handlePageClick = (page: number) => setCurrentPage(page);

  const pages = useMemo(() => {
    const maxBtns = 5;
    if (totalPages <= maxBtns)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxBtns - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  interface ContactInterface {
    _id: string;
    senderName: string;
    senderEmail: string;
    senderPhone: string;
    message: string;
    createdAt: Date;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">User Messages</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or message..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {isError && (
          <div className="text-center text-sm text-red-500">
            Failed to load messages.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isFetching && messages.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Loading…
            </div>
          ) : messages.length > 0 ? (
            messages.map((message: ContactInterface) => ( 
              <Card
                key={message._id}
                className="p-4 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {message.senderName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {message.senderEmail}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-border pt-3">
                    <p className="text-sm text-muted-foreground">
                      {message.senderPhone}
                    </p>
                    <p className="text-sm text-foreground line-clamp-2">
                      {message.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No messages found</p>
              <p className="text-muted-foreground text-sm mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-6">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
              {totalItems ? ` • ${totalItems} total` : null}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={!canPrev}
                className="bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page number buttons (optional) */}
              <div className="flex items-center gap-1">
                {pages.map((p) => (
                  <Button
                    key={p}
                    variant={currentPage === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageClick(p)}
                    className={currentPage === p ? "" : "bg-transparent"}
                  >
                    {p}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!canNext}
                className="bg-transparent"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
