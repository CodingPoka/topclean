import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

const statusColor = {
  completed: "text-emerald-400 bg-emerald-400/10",
  pending: "text-yellow-400 bg-yellow-400/10",
  cancelled: "text-red-400 bg-red-400/10",
};

export default function RecentOrders({ orders }) {
  const navigate = useNavigate();

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold text-base">Recent Orders</h3>
          <p className="text-gray-500 text-sm">Latest transactions</p>
        </div>
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {orders?.length === 0 && (
        <div className="text-center py-10 text-gray-500 text-sm">
          No orders yet
        </div>
      )}

      <div className="space-y-2 max-h-full overflow-y-auto pr-1">
        {orders?.map((order) => (
          <div
            key={order.id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-navy-600/40 transition-colors cursor-pointer"
            onClick={() => navigate(`/orders?id=${order.id}`)}
          >
            <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
              <span className="text-gold text-xs font-bold">
                {order.customerName?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {order.customerName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Room {order.roomNumber} •{" "}
                {order.createdAt?.toDate
                  ? format(order.createdAt.toDate(), "MMM d, h:mm a")
                  : "—"}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-gold">
                {order.total?.toLocaleString()} SDG
              </p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${statusColor[order.status] || statusColor.completed}`}
              >
                {order.status || "completed"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
