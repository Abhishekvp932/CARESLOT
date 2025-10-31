"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { DoctorSidebar } from "@/layout/doctor/sideBar";

import { useGetDoctorDashboardDataQuery } from "@/features/docotr/doctorApi";

export function DoctorDashboard() {
  const [period, setPeriod] = useState("month");
  const navigate = useNavigate();
  const admin = useSelector((state: RootState) => state.admin.admin);
  const patient = useSelector((state: RootState) => state.auth.user);
  const doctors = useSelector((state: RootState) => state.doctor.doctor);
  const doctorId = doctors?._id as string;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const { data = {}, isLoading } = useGetDoctorDashboardDataQuery({doctorId,period});


  const statusSummary = data?.statusSummary || [];
  const monthlyTrend = data?.monthlyTrend || [];

  const totalAppointments = statusSummary.reduce(
    (sum: number, item) => sum + (item?.value || 0),
    0
  );
  const totalEarnings = monthlyTrend.reduce(
    (sum: number, item) => sum + (item?.totalEarnings || 0),
    0
  );

  useEffect(() => {
    if (doctors?.role === "doctors") {
      setIsAuthorized(true);
    } else if (patient) {
      navigate("/");
    } else if (admin) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  }, [admin, patient, doctors, navigate]);

  if (!isAuthorized) return null;
  if (isLoading) return <div className="p-6">Loading...</div>;

  const COLORS = ["#3b82f6", "#10b981", "#ef4444"]; // blue, green, red

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 z-10">
        <DoctorSidebar />
      </div>

      {/* Main Section */}
      <div className="flex-1 ml-64">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Doctor Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's your appointment and earnings overview.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">
                  {totalAppointments}
                </div>
                <p className="text-xs text-gray-500 mt-2">This {period}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">
                  ₹{totalEarnings.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-2">This {period}</p>
              </CardContent>
            </Card>
          </div>

          {/* Period Filter */}
          <div className="flex gap-2 mb-8 bg-white p-1 rounded-lg shadow-sm border border-gray-200 inline-flex">
            {["day", "week", "month"].map((p) => (
              <Button
                key={p}
                onClick={() => setPeriod(p as "day" | "week" | "month")}
                variant={period === p ? "default" : "ghost"}
                className={`${
                  period === p
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Button>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Appointments Trend */}
            <Card className="lg:col-span-2 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Appointments Trend</CardTitle>
                <CardDescription>Appointments per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={monthlyTrend}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="bookings"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                      name="Total Bookings"
                    />
                    <Bar
                      dataKey="completed"
                      fill="#10b981"
                      radius={[8, 8, 0, 0]}
                      name="Completed"
                    />
                    <Bar
                      dataKey="cancelled"
                      fill="#ef4444"
                      radius={[8, 8, 0, 0]}
                      name="Cancelled"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Appointment Status (Pie Chart) */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Appointment Status</CardTitle>
                <CardDescription>Total: {totalAppointments}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={statusSummary}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusSummary.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Trend */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Earnings Trend</CardTitle>
              <CardDescription>Your earnings per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={monthlyTrend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="totalEarnings"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                    name="Earnings (₹)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
