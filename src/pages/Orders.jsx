import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Layout from "../components/layout/Layout";
import CreateOrderModal from "../components/orders/CreateOrderModal";
import ReceiptPrint from "../components/receipt/ReceiptPrint";
import { getOrders, deleteOrder, getOrderById } from "../firebase/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Plus, Search, Printer, Trash2, Eye, Receipt } from "lucide-react";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const receiptRef = useRef(null);

  const fetchOrders = () => {
    setLoading(true);
    getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${selectedOrder?.receiptNo || ""}`,
    onAfterPrint: () => toast.success("Receipt printed!"),
    pageStyle: `
      @page {
        size: 80mm auto;
        margin: 0;
      }
      @media print {
        body { margin: 0; }
      }
    `,
  });

  const viewReceipt = (order) => {
    setSelectedOrder(order);
    setShowReceipt(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;
    await deleteOrder(id);
    fetchOrders();
    toast.success("Order deleted");
  };

  const handleCreated = async (orderId) => {
    fetchOrders();
    const order = await getOrderById(orderId);
    setSelectedOrder(order);
    setShowReceipt(true);
  };

  const filtered = orders.filter(
    (o) =>
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search) ||
      o.receiptNo?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout title="Orders">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            className="input-field pl-9 py-2 text-sm w-full sm:w-72"
            placeholder="Search by name, phone, receipt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-gold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-500/30">
                <th className="text-left p-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  Receipt #
                </th>
                <th className="text-left p-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  Customer
                </th>
                <th className="text-left p-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  Phone
                </th>
                <th className="text-left p-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  Services
                </th>
                <th className="text-left p-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  Date
                </th>
                <th className="text-right p-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  Total
                </th>
                <th className="text-right p-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-gray-500 text-sm"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-gray-500 text-sm"
                  >
                    {search
                      ? "No orders match your search."
                      : "No orders yet. Create your first order!"}
                  </td>
                </tr>
              ) : (
                filtered.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-navy-500/20 hover:bg-navy-600/20 transition-colors"
                  >
                    <td className="p-4 text-xs text-gold font-mono">
                      {order.receiptNo}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-xs font-bold text-gold">
                          {order.customerName?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="text-sm text-white font-medium">
                          {order.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {order.phone || "—"}
                    </td>
                    <td className="p-4 text-sm text-gray-400 max-w-xs truncate">
                      {order.items?.map((i) => i.name).join(", ")}
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {order.createdAt?.toDate
                        ? format(order.createdAt.toDate(), "MMM d, yyyy")
                        : "—"}
                    </td>
                    <td className="p-4 text-right text-sm font-semibold text-gold">
                      ৳{order.total?.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewReceipt(order)}
                          className="p-1.5 rounded-lg hover:bg-gold/10 text-gray-400 hover:text-gold transition-colors"
                          title="View Receipt"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-1.5 rounded-lg hover:bg-red-900/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-3 flex items-center justify-between gap-2 flex-wrap text-xs text-gray-600">
        <span>
          Showing {filtered.length} of {orders.length} orders
        </span>
        <span>
          Total:{" "}
          <span className="text-gold font-semibold">
            ৳{filtered.reduce((s, o) => s + (o.total || 0), 0).toLocaleString()}
          </span>
        </span>
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />

      {/* Receipt Preview Modal */}
      <AnimatePresence>
        {showReceipt && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowReceipt(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="no-print sticky top-0 bg-gray-50 border-b px-4 sm:px-6 py-3 flex items-center justify-between gap-2 z-10">
                <span className="text-sm font-semibold text-gray-700">
                  Receipt Preview
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrint()}
                    className="flex items-center gap-1.5 bg-[#0A1628] text-[#D4AF37] text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl font-medium hover:bg-[#112240] transition-colors"
                  >
                    <Printer className="w-4 h-4" /> Print Receipt
                  </button>
                  <button
                    onClick={() => setShowReceipt(false)}
                    className="text-gray-400 hover:text-gray-600 px-3 py-2 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
              <ReceiptPrint ref={receiptRef} order={selectedOrder} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
