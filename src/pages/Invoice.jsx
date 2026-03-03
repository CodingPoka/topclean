import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Layout from "../components/layout/Layout";
import InvoicePrint from "../components/invoice/InvoicePrint";
import { getOrdersByDateRange, getOrders } from "../firebase/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Search, Printer, FileText, Calendar, User } from "lucide-react";
import toast from "react-hot-toast";

export default function Invoice() {
  const today = format(new Date(), "yyyy-MM-dd");
  const firstOfMonth = format(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    "yyyy-MM-dd",
  );

  const [dateFrom, setDateFrom] = useState(firstOfMonth);
  const [dateTo, setDateTo] = useState(today);
  const [customerFilter, setCustomerFilter] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const invoiceRef = useRef(null);

  const handleGenerate = async () => {
    if (!dateFrom || !dateTo) return toast.error("Select a date range");
    setLoading(true);
    try {
      let data = await getOrdersByDateRange(dateFrom, dateTo);
      if (customerFilter.trim()) {
        data = data.filter((o) =>
          o.customerName?.toLowerCase().includes(customerFilter.toLowerCase()),
        );
      }
      setOrders(data);
      setGenerated(true);
      setShowPreview(true);
      if (data.length === 0)
        toast("No orders found for this range.", { icon: "ℹ️" });
    } catch (e) {
      toast.error("Failed to generate invoice");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice_${dateFrom}_to_${dateTo}`,
    onAfterPrint: () => toast.success("Invoice printed!"),
  });

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <Layout title="Invoice Generator">
      <div className="max-w-4xl">
        {/* Filter Card */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">
                Generate Invoice
              </h2>
              <p className="text-gray-500 text-xs">
                Filter orders by date range or customer
              </p>
            </div>
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-400 flex items-center gap-1 mb-1.5">
                <User className="w-3 h-3" /> Invoice To (Client / Hotel Name)
              </label>
              <input
                className="input-field text-sm py-2"
                placeholder="e.g. Bel Mar Residence Hotel"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">
                Address (optional)
              </label>
              <input
                className="input-field text-sm py-2"
                placeholder="e.g. Port Sudan"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-xs text-gray-400 flex items-center gap-1 mb-1.5">
                <Calendar className="w-3 h-3" /> From Date
              </label>
              <input
                type="date"
                className="input-field text-sm py-2"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 flex items-center gap-1 mb-1.5">
                <Calendar className="w-3 h-3" /> To Date
              </label>
              <input
                type="date"
                className="input-field text-sm py-2"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 flex items-center gap-1 mb-1.5">
                <User className="w-3 h-3" /> Customer (optional)
              </label>
              <input
                className="input-field text-sm py-2"
                placeholder="Filter by name..."
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-gold flex items-center justify-center gap-2 py-2.5"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-navy-900/40 border-t-navy-900 rounded-full animate-spin" />
              ) : (
                <>
                  <FileText className="w-4 h-4" /> Generate
                </>
              )}
            </button>
          </div>

          {/* Quick range buttons */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {["Today", "This Week", "This Month", "Last Month"].map((label) => {
              const now = new Date();
              const ranges = {
                Today: [today, today],
                "This Week": [
                  format(
                    new Date(now.setDate(now.getDate() - now.getDay())),
                    "yyyy-MM-dd",
                  ),
                  today,
                ],
                "This Month": [firstOfMonth, today],
                "Last Month": [
                  format(
                    new Date(now.getFullYear(), now.getMonth() - 1, 1),
                    "yyyy-MM-dd",
                  ),
                  format(
                    new Date(now.getFullYear(), now.getMonth(), 0),
                    "yyyy-MM-dd",
                  ),
                ],
              };
              return (
                <button
                  key={label}
                  onClick={() => {
                    setDateFrom(ranges[label][0]);
                    setDateTo(ranges[label][1]);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-navy-800 border border-navy-500/40 text-gray-400 hover:border-gold/40 hover:text-gold transition-all"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results summary */}
        {generated && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-5 mb-4 border border-gold/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-gray-500">Orders Found</p>
                  <p className="text-xl font-bold text-white">
                    {orders.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Revenue</p>
                  <p className="text-xl font-bold text-gold">
                    ৳{totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Period</p>
                  <p className="text-sm font-medium text-white">
                    {dateFrom} → {dateTo}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreview(true)}
                  className="btn-outline flex items-center gap-2 text-sm py-2"
                >
                  <FileText className="w-4 h-4" /> Preview
                </button>
                <button
                  onClick={() => {
                    setShowPreview(true);
                    setTimeout(handlePrint, 300);
                  }}
                  className="btn-gold flex items-center gap-2 text-sm py-2"
                >
                  <Printer className="w-4 h-4" /> Print Invoice
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {generated && orders.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-500 text-sm">
              No orders found for the selected range.
            </p>
          </div>
        )}
      </div>

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {showPreview && orders.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowPreview(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="no-print sticky top-0 bg-gray-50 border-b px-6 py-3 flex items-center justify-between z-10">
                <span className="text-sm font-semibold text-gray-700">
                  Invoice Preview — {orders.length} orders
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrint()}
                    className="flex items-center gap-1.5 bg-[#0A1628] text-[#D4AF37] text-sm px-4 py-2 rounded-xl font-medium hover:bg-[#112240] transition-colors"
                  >
                    <Printer className="w-4 h-4" /> Print Invoice
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600 px-3 py-2 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
              <InvoicePrint
                ref={invoiceRef}
                orders={orders}
                dateFrom={dateFrom}
                dateTo={dateTo}
                customerFilter={customerFilter || null}
                clientName={clientName || null}
                clientAddress={clientAddress || null}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
