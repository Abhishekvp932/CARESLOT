import { Button } from "@/components/ui/button";
import { useFindAllUserSubscriptionQuery } from "@/features/admin/adminApi";
import { Mail, DollarSign, User } from "lucide-react";
import { useEffect, useState } from "react";

export interface UserSubscriptionPatientPopulated {
  _id?: string;
  name?: string;
  email?: string;
}

export interface UserSubscriptionPlanPopulated {
  _id?: string;
  name?: string;
  price?: number;
}

export interface IUserSubscriptionPopulated {
  _id?: string;
  patientId?: UserSubscriptionPatientPopulated;
  planId?: UserSubscriptionPlanPopulated;
  transactionId?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const planColors: Record<string, { bg: string; text: string; badge: string }> = {
  Silver: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    badge: "bg-gray-200 text-gray-800",
  },
  Gold: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    badge: "bg-amber-200 text-amber-800",
  },
  Platinum: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    badge: "bg-purple-200 text-purple-800",
  },
};

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Expired: "bg-red-100 text-red-800",
};

const getStatusInfo = (isActive?: boolean) => {
  return {
    label: isActive ? "Active" : "Expired",
    color: isActive ? statusColors.Active : statusColors.Expired,
  };
};

// ✨ FINAL Correct formatDate – Single definition (NO duplicate)
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

export default function SubscriptionListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Backend Pagination Call
  const { data } = useFindAllUserSubscriptionQuery({
    page: currentPage,
    limit: pageSize,
  });

  const subscription: IUserSubscriptionPopulated[] = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const currentPageFromApi = data?.currentPage || 1;

  useEffect(() => {
    if (currentPageFromApi !== currentPage) {
      setCurrentPage(currentPageFromApi);
    }
  }, [currentPageFromApi, currentPage]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          User Subscriptions
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          View and manage all user subscriptions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Total Subscriptions</p>
          <p className="mt-2 text-3xl font-bold">{subscription.length}</p>
        </div>
        <div className="rounded-lg border bg-green-50 p-6 shadow-sm">
          <p className="text-sm text-green-700">Active Subscriptions</p>
          <p className="mt-2 text-3xl font-bold text-green-900">
            {subscription.filter((s) => s.isActive).length}
          </p>
        </div>
        <div className="rounded-lg border bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-700">Expired Subscriptions</p>
          <p className="mt-2 text-3xl font-bold text-red-900">
            {subscription.filter((s) => s.isActive === false).length}
          </p>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Plan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">End Date</th>
              </tr>
            </thead>

            <tbody>
              {subscription.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscription.map((sub) => (
                  <tr key={sub._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        {sub?.patientId?.name || "N/A"}
                      </div>
                    </td>

                    <td className="px-6 py-4 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {sub?.patientId?.email || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          planColors[sub?.planId?.name || ""]?.badge ||
                          "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {sub?.planId?.name || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-4 flex items-center gap-1 font-semibold">
                      <DollarSign className="h-4 w-4" />₹{sub?.planId?.price || 0}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${getStatusInfo(
                          sub.isActive
                        ).color}`}
                      >
                        {getStatusInfo(sub.isActive).label}
                      </span>
                    </td>

                    <td className="px-6 py-4">{formatDate(sub.endDate)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
          Previous
        </Button>

        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </main>
  );
}
