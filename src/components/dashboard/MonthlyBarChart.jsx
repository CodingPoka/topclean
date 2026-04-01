import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-navy-800 border border-gold/20 rounded-xl p-3 shadow-card text-sm">
        <p className="text-gold font-medium mb-1">{label}</p>
        <p className="text-white">
          Revenue:{" "}
          <span className="text-gold font-semibold">
            ج.س..{payload[0]?.value?.toLocaleString()}
          </span>
        </p>
        <p className="text-gray-400">Orders: {payload[1]?.value}</p>
      </div>
    );
  }
  return null;
};

export default function MonthlyBarChart({ data }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-base">
            Monthly Revenue
          </h3>
          <p className="text-gray-500 text-sm">Last 6 months performance</p>
        </div>
        <span className="text-xs text-gold bg-gold/10 border border-gold/20 px-3 py-1 rounded-full">
          Bar Chart
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e3a6e"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8892a4", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8892a4", fontSize: 11 }}
            tickFormatter={(v) => `ج.س..${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(212,175,55,0.05)" }}
          />
          <Bar
            dataKey="revenue"
            fill="#D4AF37"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="orders"
            fill="#2a4f8f"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-gold" />
          Revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-navy-400" />
          Orders
        </span>
      </div>
    </div>
  );
}
