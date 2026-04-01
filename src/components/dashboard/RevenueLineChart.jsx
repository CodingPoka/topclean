import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-navy-800 border border-gold/20 rounded-xl p-3 shadow-card text-sm">
        <p className="text-gold font-medium mb-1">{label}</p>
        <p className="text-white">ج.س..{payload[0]?.value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function RevenueLineChart({ data }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-base">Revenue Trend</h3>
          <p className="text-gray-500 text-sm">6-month overview</p>
        </div>
        <span className="text-xs text-gold bg-gold/10 border border-gold/20 px-3 py-1 rounded-full">
          Area Chart
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#D4AF37"
            strokeWidth={2.5}
            fill="url(#goldGradient)"
            dot={{ fill: "#D4AF37", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#F0C860" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
