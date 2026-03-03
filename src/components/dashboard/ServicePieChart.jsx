import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#D4AF37",
  "#F0C860",
  "#2a4f8f",
  "#3b6fca",
  "#1e3a6e",
  "#64748b",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-navy-800 border border-gold/20 rounded-xl p-3 shadow-card text-sm">
        <p className="text-gold font-medium">{payload[0].name}</p>
        <p className="text-white">
          Count: <span className="font-semibold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ServicePieChart({ data }) {
  const hasData = data && data.length > 0;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-base">
            Service Distribution
          </h3>
          <p className="text-gray-500 text-sm">Orders by service type</p>
        </div>
        <span className="text-xs text-gold bg-gold/10 border border-gold/20 px-3 py-1 rounded-full">
          Pie Chart
        </span>
      </div>
      {hasData ? (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.slice(0, 6)}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="count"
                labelLine={false}
                label={renderCustomLabel}
              >
                {data.slice(0, 6).map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {data.slice(0, 4).map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 text-gray-400">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: COLORS[i] }}
                  />
                  {item.name}
                </span>
                <span className="text-white font-medium">
                  {item.count} orders
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-[220px] flex items-center justify-center">
          <p className="text-gray-500 text-sm">No data yet</p>
        </div>
      )}
    </div>
  );
}
