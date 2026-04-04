import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getOrders } from "../firebase/helpers";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, DollarSign, Package, Star } from "lucide-react";

const COLORS = [
  "#D4AF37",
  "#F0C860",
  "#2a4f8f",
  "#3b6fca",
  "#1e3a6e",
  "#64748b",
];

export default function Reports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Monthly breakdown (last 12 months)
  const months = eachMonthOfInterval({
    start: subMonths(new Date(), 11),
    end: new Date(),
  });
  const monthlyData = months.map((m) => {
    const mOrders = orders.filter((o) => {
      const d = o.createdAt?.toDate?.();
      return d && d >= startOfMonth(m) && d <= endOfMonth(m);
    });
    return {
      month: format(m, "MMM yy"),
      revenue: mOrders.reduce((s, o) => s + (o.total || 0), 0),
      orders: mOrders.length,
    };
  });

  // Service performance
  const svcMap = {};
  orders.forEach((o) =>
    o.items?.forEach((item) => {
      if (!svcMap[item.name])
        svcMap[item.name] = { name: item.name, qty: 0, revenue: 0 };
      svcMap[item.name].qty += item.qty;
      svcMap[item.name].revenue += item.price * item.qty;
    }),
  );
  const serviceData = Object.values(svcMap).sort(
    (a, b) => b.revenue - a.revenue,
  );

  // Top customers
  const custMap = {};
  orders.forEach((o) => {
    const k = o.customerName || "Unknown";
    if (!custMap[k]) custMap[k] = { name: k, orders: 0, spent: 0 };
    custMap[k].orders++;
    custMap[k].spent += o.total || 0;
  });
  const topCustomers = Object.values(custMap).sort((a, b) => b.spent - a.spent);

  if (loading)
    return (
      <Layout title="Reports">
        <div className="flex items-center justify-center h-96">
          <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      </Layout>
    );

  return (
    <Layout title="Reports & Analytics">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Revenue",
            value: `${orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString()} SDG`,
            icon: DollarSign,
            color: "#D4AF37",
          },
          {
            label: "Total Orders",
            value: orders.length,
            icon: Package,
            color: "#60a5fa",
          },
          {
            label: "Services",
            value: serviceData.length,
            icon: Star,
            color: "#34d399",
          },
          {
            label: "Unique Guests",
            value: Object.keys(custMap).length,
            icon: TrendingUp,
            color: "#a78bfa",
          },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 12-month Revenue Chart */}
      <div className="card p-6 mb-4">
        <h3 className="text-white font-semibold mb-1">12-Month Revenue</h3>
        <p className="text-gray-500 text-sm mb-5">
          Full year performance overview
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e3a6e"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8892a4", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8892a4", fontSize: 11 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k SDG`}
            />
            <Tooltip
              contentStyle={{
                background: "#112240",
                border: "1px solid rgba(212,175,55,0.2)",
                borderRadius: "12px",
                color: "white",
                fontSize: "12px",
              }}
              formatter={(v, n) => [
                n === "revenue" ? `${v.toLocaleString()} SDG` : v,
                n === "revenue" ? "Revenue" : "Orders",
              ]}
            />
            <Bar
              dataKey="revenue"
              fill="#D4AF37"
              radius={[5, 5, 0, 0]}
              maxBarSize={36}
            />
            <Bar
              dataKey="orders"
              fill="#2a4f8f"
              radius={[5, 5, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Service Performance */}
        <div className="card p-6">
          <h3 className="text-white font-semibold mb-1">Top Services</h3>
          <p className="text-gray-500 text-sm mb-5">By revenue generated</p>
          {serviceData.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">
              No data yet
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {serviceData.map((s, i) => {
                const max = serviceData[0].revenue;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300 font-medium">
                        {s.name}
                      </span>
                      <span className="text-gold font-semibold">
                        {s.revenue.toLocaleString()} SDG
                      </span>
                    </div>
                    <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gold-gradient"
                        style={{
                          width: `${(s.revenue / max) * 100}%`,
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {s.qty} items
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Customers */}
        <div className="card p-6">
          <h3 className="text-white font-semibold mb-1">Top Guests</h3>
          <p className="text-gray-500 text-sm mb-5">By total spend</p>
          {topCustomers.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">
              No data yet
            </p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {topCustomers.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-navy-600/30 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold
                    ${i === 0 ? "bg-gold/20 text-gold border border-gold/30" : "bg-navy-600 text-gray-300 border border-navy-500/30"}`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.orders} orders</p>
                  </div>
                  <p className="text-sm font-semibold text-gold">
                    {c.spent.toLocaleString()} SDG
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
