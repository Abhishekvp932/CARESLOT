"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Loader2, Banknote } from "lucide-react"
import { useGetAdminDashboardDataQuery } from "@/features/admin/adminApi"

const COLORS = {
  primary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  purple: "#a855f7",
}

const STATUS_COLORS = {
  Completed: COLORS.success,
  Scheduled: COLORS.info,
  Cancelled: COLORS.danger,
  Pending: COLORS.warning,
}

export function AdminDashboard() {
  const [timeFilter, setTimeFilter] = useState("month")
  const { data, isLoading, isError, error } = useGetAdminDashboardDataQuery(timeFilter)
  
  
  console.log('dashboard data', data)

  const calculateMetrics = () => {
    if (!data?.monthlyTrend || !Array.isArray(data.monthlyTrend)) {
      return {
        totalBookings: 0,
        completionRate: 0,
        totalCompleted: 0,
        totalCancelled: 0,
        totalEarnings: 0,
      }
    }

    const totals = data.monthlyTrend.reduce(
      (acc, month) => ({
        bookings: acc.bookings + (month.bookings || 0),
        completed: acc.completed + (month.completed || 0),
        cancelled: acc.cancelled + (month.cancelled || 0),
        totalEarnings: acc.totalEarnings + (month.totalEarnings || 0),
      }),
      { bookings: 0, completed: 0, cancelled: 0, totalEarnings: 0 }
    )
    return {
      totalBookings: totals.bookings,
      totalCompleted: totals.completed,
      totalCancelled: totals.cancelled,
      totalEarnings: totals.totalEarnings
    }
  }

  const metrics = calculateMetrics()

  const pieChartData = Array.isArray(data?.statusSummary)
    ? data.statusSummary.map(item => ({
        ...item,
        fill: STATUS_COLORS[item.name] || COLORS.info,
      }))
    : []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-red-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h3>
                <p className="text-red-700 text-sm">
                  {error?.message || "Failed to load dashboard data. Please try again later."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your booking analytics overview.</p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => setTimeFilter("day")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeFilter === "day"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setTimeFilter("week")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeFilter === "week"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeFilter("month")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeFilter === "month"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <MetricCard
          title="Total Appointments"
          value={metrics.totalBookings.toLocaleString()}
          icon={<Calendar className="w-5 h-5" />}
          trendPositive
          color={COLORS.primary}
        />
        <MetricCard 
          title="Active Doctors" 
          value={data?.activeDoctorsCount} 
          icon={<Users className="w-5 h-5" />} 
          trendPositive 
          color={COLORS.success}
        />
        <MetricCard 
          title="Earnings" 
          value={`₹${metrics.totalEarnings?.toLocaleString()}`} 
          icon={<Banknote className="w-5 h-5" />} 
          trendPositive 
          color={COLORS.purple}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Booking Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
            <CardDescription>
              {timeFilter === "day" && "Daily booking statistics"}
              {timeFilter === "week" && "Weekly booking statistics"}
              {timeFilter === "month" && "Monthly booking statistics"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Array.isArray(data?.monthlyTrend) && data.monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="bookings" fill={COLORS.primary} radius={[8, 8, 0, 0]} name="Total Bookings" />
                  <Bar dataKey="completed" fill={COLORS.success} radius={[8, 8, 0, 0]} name="Completed" />
                  <Bar dataKey="cancelled" fill={COLORS.danger} radius={[8, 8, 0, 0]} name="Cancelled" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <p>No booking trend data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appointment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
            <CardDescription>Distribution overview</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <p>No status data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Doctors</CardTitle>
            <CardDescription>Performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.topDoctors && data.topDoctors.length > 0 ? (
                data.topDoctors.map((doctor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">Dr. {doctor.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-yellow-500">{doctor.avgRating}★</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No doctor data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, trend, trendPositive, color }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20`, color: color }}>
            {icon}
          </div>
          {trend && (
            <span className={`text-xs font-semibold ${trendPositive ? "text-green-600" : "text-red-600"}`}>
              {trend}
            </span>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  )
}