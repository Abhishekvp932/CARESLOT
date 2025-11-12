"use client";

// import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  Shield,
  Stethoscope,
  Wallet,
  CreditCard,
  Receipt,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useGetWalletDataQuery } from "@/features/users/userApi";
import { ToastContainer } from "react-toastify";
export default function UserWallet() {
  const patient = useSelector((state: RootState) => state.auth.user);
  const patientId = patient?._id as string;
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data = {} } = useGetWalletDataQuery({
    patientId,
    page,
    limit,
  });

  const walletHistory = data?.data || [];

  const totalPages = data?.totalPages || 1;
  const walletBalance = data?.balance || 0;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Stethoscope className="h-4 w-4" />;
      case "refund":
        return <RefreshCw className="h-4 w-4" />;
      case "deposit":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  type Transaction = {
    _id: string;
    amount: number;
    type: string;
    source: string;
    paymentMethod: string;
    createdAt: string;
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Medical Wallet</h1>
            <p className="text-muted-foreground text-pretty">
              Manage your healthcare payments and insurance benefits
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">HIPAA Compliant</span>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="max-w-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Wallet Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{walletBalance}</div>
              <p className="text-xs text-muted-foreground">
                Available for appointments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      Transaction History
                    </CardTitle>
                    <CardDescription>
                      View all your medical payments and transactions
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {walletHistory.map((transaction: Transaction) => (
                    <div
                      key={transaction?._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                          {getTransactionIcon(transaction?.source)}
                        </div>
                        <div>
                          <p className="font-medium text-pretty">
                            {transaction?.source}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-muted-foreground">
                              {new Date(
                                transaction?.createdAt
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>

                            <span className="text-muted-foreground">•</span>
                            <p className="text-sm text-muted-foreground">
                              {transaction?.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              transaction.amount > 0
                                ? "text-green-600"
                                : "text-foreground"
                            }`}
                          >
                            {transaction?.amount > 0 ? "+" : ""}₹
                            {Math.abs(transaction?.amount).toFixed(2)}
                          </p>
                          <Badge
                            variant={getStatusColor(transaction?.type)}
                            className="text-xs"
                          >
                            {transaction?.type}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Receipt className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                          <Button
                            key={p}
                            variant={page === p ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(p)}
                            className="w-8 h-8"
                          >
                            {p}
                          </Button>
                        )
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={page === totalPages}
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <ToastContainer autoClose={2000} />
    </main>
  );
}
