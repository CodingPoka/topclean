import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const sales = payload.find((p) => p.dataKey === "sales")?.value || 0;
    const orders = payload.find((p) => p.dataKey === "orders")?.value || 0;

    return (
      <div className="bg-navy-800 border border-gold/20 rounded-xl p-3 shadow-card text-sm">
        <p className="text-gold font-medium mb-1">{label}</p>
        <p className="text-white">
          Sales:{" "}
          <span className="text-gold font-semibold">
            ৳{sales.toLocaleString()}
          </span>
        </p>
        <p className="text-gray-400">Orders: {orders}</p>
      </div>
    );
  }
  return null;
};

export default function DailySevenLineChart({
  data,
  selectedMonth,
  onMonthChange,
  loading,
}) {
  const [rangeDays, setRangeDays] = useState(7);
  const [windowOffset, setWindowOffset] = useState(0);

  useEffect(() => {
    setWindowOffset(0);
  }, [selectedMonth, rangeDays, data?.length]);

  const visibleData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const end = data.length - windowOffset * rangeDays;
    const safeEnd = Math.max(0, end);
    const start = Math.max(0, safeEnd - rangeDays);

    return data.slice(start, safeEnd);
  }, [data, windowOffset, rangeDays]);

  const hasPreviousWindow =
    Array.isArray(data) && data.length - (windowOffset + 1) * rangeDays > 0;
  const hasNextWindow = windowOffset > 0;

  const windowRangeLabel = useMemo(() => {
    if (!visibleData.length) return "No records";
    return `${visibleData[0].axisLabel} - ${visibleData[visibleData.length - 1].axisLabel}`;
  }, [visibleData]);

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h3 className="text-white font-semibold text-base">
            Daily Orders & Sales
          </h3>
          <p className="text-gray-500 text-sm">
            View 7-day or 15-day windows in selected month
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs text-gray-400">Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="bg-navy-800 border border-navy-500/40 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-gold/50"
          />
          <div className="ml-0 sm:ml-2 inline-flex rounded-lg overflow-hidden border border-navy-500/40">
            {[7, 15].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setRangeDays(days)}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  rangeDays === days
                    ? "bg-gold/20 text-gold"
                    : "bg-navy-800 text-gray-400 hover:text-white"
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-500">{windowRangeLabel}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWindowOffset((prev) => prev + 1)}
            disabled={!hasPreviousWindow}
            className="p-1.5 rounded-lg border border-navy-500/40 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            title="Previous window"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setWindowOffset((prev) => Math.max(prev - 1, 0))}
            disabled={!hasNextWindow}
            className="p-1.5 rounded-lg border border-navy-500/40 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            title="Next window"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-[240px] flex items-center justify-center">
          <span className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={visibleData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e3a6e"
                vertical={false}
              />
              <XAxis
                dataKey="axisLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#8892a4", fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#8892a4", fontSize: 11 }}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#8892a4", fontSize: 11 }}
                tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={<CustomTooltip />}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.dateLabel || ""
                }
              />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="orders"
                stroke="#60A5FA"
                strokeWidth={2.5}
                dot={{ fill: "#60A5FA", r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sales"
                stroke="#D4AF37"
                strokeWidth={2.5}
                dot={{ fill: "#D4AF37", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              Orders
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gold" />
              Sales
            </span>
          </div>
        </>
      )}
    </div>
  );
}
