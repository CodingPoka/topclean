import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import StatsCard from "../components/dashboard/StatsCard";
import MonthlyBarChart from "../components/dashboard/MonthlyBarChart";
import ServicePieChart from "../components/dashboard/ServicePieChart";
import RevenueLineChart from "../components/dashboard/RevenueLineChart";
import DailySevenLineChart from "../components/dashboard/DailySevenLineChart";
import RecentOrders from "../components/dashboard/RecentOrders";
import { getDashboardStats, getDailyRecordsByMonth } from "../firebase/helpers";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [dailyData, setDailyData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setDailyLoading(true);
    getDailyRecordsByMonth(selectedMonth)
      .then(setDailyData)
      .catch(console.error)
      .finally(() => setDailyLoading(false));
  }, [selectedMonth]);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      {/* Welcome banner */}
      <div className="bg-gold-gradient rounded-2xl p-6 mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-navy-900">
            Good{" "}
            {new Date().getHours() < 12
              ? "Morning"
              : new Date().getHours() < 17
                ? "Afternoon"
                : "Evening"}
            , Admin! 👋
          </h1>
          <p className="text-navy-700 text-sm mt-0.5">
            Here's what's happening at Top Clean today.
          </p>
        </div>
        <div className="text-navy-800 text-right hidden sm:block">
          <p className="text-3xl font-bold">{stats?.todayOrders || 0}</p>
          <p className="text-xs text-navy-600">orders today</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Revenue"
          value={`৳${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="gold"
          delay={0}
        />
        <StatsCard
          title="Today's Sales"
          value={`৳${(stats?.todaySales || 0).toLocaleString()}`}
          icon={Clock}
          color="green"
          delay={0.05}
          subtitle="Current day"
        />
        <StatsCard
          title="Monthly Sales"
          value={`৳${(stats?.monthSales || 0).toLocaleString()}`}
          icon={TrendingUp}
          color="blue"
          delay={0.1}
          subtitle="This month"
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
          color="purple"
          delay={0.15}
          subtitle={`${stats?.monthOrders || 0} this month`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 space-y-4">
          <DailySevenLineChart
            data={dailyData}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            loading={dailyLoading}
          />
          <MonthlyBarChart data={stats?.monthlyData || []} />
          <RevenueLineChart data={stats?.monthlyData || []} />
        </div>

        <div className="space-y-4">
          <ServicePieChart data={stats?.serviceData || []} />
          <RecentOrders orders={stats?.recentOrders || []} />
        </div>
      </div>
    </Layout>
  );
}
