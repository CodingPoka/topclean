import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Layout from "../components/layout/Layout";
import InvoicePrint from "../components/invoice/InvoicePrint";
import {
  getOrdersByDateRange,
  getOrders,
  getOrderById,
  createInvoice,
  getInvoices,
  deleteInvoice,
} from "../firebase/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Search,
  Printer,
  FileText,
  Calendar,
  User,
  Eye,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Invoice() {
  const today = format(new Date(), "yyyy-MM-dd");
  const firstOfMonth = format(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    "yyyy-MM-dd",
  );

  const [dateFrom, setDateFrom] = useState(firstOfMonth);
  const [dateTo, setDateTo] = useState(today);
  const [allOrders, setAllOrders] = useState([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [clientAddress, setClientAddress] = useState("");
  const [orders, setOrders] = useState([]);
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewOrders, setPreviewOrders] = useState([]);
  const [previewMeta, setPreviewMeta] = useState(null);
  const [viewingInvoiceId, setViewingInvoiceId] = useState(null);
  const invoiceRef = useRef(null);
  const customerPickerRef = useRef(null);

  const fetchSavedInvoices = () => {
    getInvoices().then(setSavedInvoices).catch(console.error);
  };

  useEffect(() => {
    getOrders().then(setAllOrders).catch(console.error);
    fetchSavedInvoices();
  }, []);

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (!customerPickerRef.current?.contains(event.target)) {
        setShowCustomerList(false);
      }
    };
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  const customers = useMemo(() => {
    const map = new Map();
    allOrders.forEach((order) => {
      const name = order.customerName?.trim();
      const phone = order.phone?.trim() || "";
      if (!name) return;
      const key = `${name.toLowerCase()}|${phone}`;
      if (!map.has(key)) {
        map.set(key, { name, phone });
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [allOrders]);

  const customerSuggestions = useMemo(() => {
    const query = customerQuery.trim().toLowerCase();
    if (!query) return customers.slice(0, 8);
    return customers
      .filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.phone.toLowerCase().includes(query),
      )
      .slice(0, 8);
  }, [customers, customerQuery]);

  const filteredInvoices = useMemo(() => {
    const query = invoiceSearch.trim().toLowerCase();
    if (!query) return savedInvoices;
    return savedInvoices.filter((invoice) => {
      const invoiceNo = invoice.invoiceNo?.toLowerCase() || "";
      const customerName = invoice.customerName?.toLowerCase() || "";
      const customerPhone = invoice.customerPhone?.toLowerCase() || "";
      const period =
        `${invoice.dateFrom || ""} ${invoice.dateTo || ""}`.toLowerCase();
      return (
        invoiceNo.includes(query) ||
        customerName.includes(query) ||
        customerPhone.includes(query) ||
        period.includes(query)
      );
    });
  }, [savedInvoices, invoiceSearch]);

  const saveGeneratedInvoice = async (invoiceOrders) => {
    if (invoiceOrders.length === 0) return;
    const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;
    const customerName =
      selectedCustomer?.name || customerQuery || "All Customers";
    const customerPhone = selectedCustomer?.phone || "";
    const totalAmount = invoiceOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0,
    );

    setSavingInvoice(true);
    try {
      await createInvoice({
        invoiceNo,
        dateFrom,
        dateTo,
        customerName,
        customerPhone,
        clientAddress: clientAddress || "",
        ordersCount: invoiceOrders.length,
        orderIds: invoiceOrders.map((order) => order.id),
        totalAmount,
      });
      fetchSavedInvoices();
      toast.success("Invoice saved to Firebase");
    } catch (error) {
      toast.error("Invoice generated but failed to save");
      console.error(error);
    } finally {
      setSavingInvoice(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!confirm("Delete this saved invoice?")) return;
    try {
      await deleteInvoice(invoiceId);
      setSavedInvoices((prev) =>
        prev.filter((invoice) => invoice.id !== invoiceId),
      );
      toast.success("Invoice deleted");
    } catch (error) {
      toast.error("Failed to delete invoice");
      console.error(error);
    }
  };

  const handleViewSavedInvoice = async (invoice) => {
    setViewingInvoiceId(invoice.id);
    try {
      let invoiceOrders = [];
      if (Array.isArray(invoice.orderIds) && invoice.orderIds.length > 0) {
        const fetched = await Promise.all(
          invoice.orderIds.map((orderId) => getOrderById(orderId)),
        );
        invoiceOrders = fetched.filter(Boolean);
      } else {
        invoiceOrders = await getOrdersByDateRange(
          invoice.dateFrom,
          invoice.dateTo,
        );
        if (invoice.customerPhone) {
          invoiceOrders = invoiceOrders.filter(
            (order) => (order.phone || "").trim() === invoice.customerPhone,
          );
        } else if (
          invoice.customerName &&
          invoice.customerName !== "All Customers"
        ) {
          invoiceOrders = invoiceOrders.filter(
            (order) =>
              (order.customerName || "").trim().toLowerCase() ===
              invoice.customerName.toLowerCase(),
          );
        }
      }

      if (invoiceOrders.length === 0) {
        toast.error("No orders found for this saved invoice");
        return;
      }

      setPreviewOrders(invoiceOrders);
      setPreviewMeta({
        dateFrom: invoice.dateFrom,
        dateTo: invoice.dateTo,
        customerFilter: invoice.customerName || null,
        clientName: invoice.customerName || null,
        clientAddress: invoice.clientAddress || null,
      });
      setShowPreview(true);
    } catch (error) {
      toast.error("Failed to load saved invoice");
      console.error(error);
    } finally {
      setViewingInvoiceId(null);
    }
  };

  const handleGenerate = async () => {
    if (!dateFrom || !dateTo) return toast.error("Select a date range");
    setLoading(true);
    try {
      let data = await getOrdersByDateRange(dateFrom, dateTo);
      const typedFilter = customerQuery.trim().toLowerCase();

      if (selectedCustomer) {
        if (selectedCustomer.phone) {
          data = data.filter(
            (order) =>
              (order.phone || "").trim().toLowerCase() ===
              selectedCustomer.phone.toLowerCase(),
          );
        } else {
          data = data.filter(
            (order) =>
              order.customerName?.trim().toLowerCase() ===
              selectedCustomer.name.toLowerCase(),
          );
        }
      } else if (typedFilter) {
        data = data.filter(
          (o) =>
            o.customerName?.toLowerCase().includes(typedFilter) ||
            o.phone?.toLowerCase().includes(typedFilter),
        );
      }

      setOrders(data);
      setPreviewOrders(data);
      setPreviewMeta({
        dateFrom,
        dateTo,
        customerFilter: customerQuery || null,
        clientName: selectedCustomer
          ? selectedCustomer.phone
            ? `${selectedCustomer.name} (${selectedCustomer.phone})`
            : selectedCustomer.name
          : null,
        clientAddress: clientAddress || null,
      });
      setGenerated(true);
      setShowPreview(true);
      await saveGeneratedInvoice(data);
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
    documentTitle: `Invoice_${previewMeta?.dateFrom || dateFrom}_to_${previewMeta?.dateTo || dateTo}`,
    onAfterPrint: () => toast.success("Invoice printed!"),
  });

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <Layout title="Invoice Generator">
      <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
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
            <div ref={customerPickerRef} className="relative">
              <label className="text-xs text-gray-400 flex items-center gap-1 mb-1.5">
                <User className="w-3 h-3" /> Customer (Name or Phone)
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  className="input-field text-sm py-2 pl-9"
                  placeholder="Type customer name or phone"
                  value={customerQuery}
                  onFocus={() => setShowCustomerList(true)}
                  onChange={(e) => {
                    setCustomerQuery(e.target.value);
                    setSelectedCustomer(null);
                    setShowCustomerList(true);
                  }}
                />
              </div>

              {showCustomerList && customerSuggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-navy-800 border border-navy-500/40 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                  {customerSuggestions.map((customer) => {
                    const key = `${customer.name}-${customer.phone || "no-phone"}`;
                    return (
                      <button
                        key={key}
                        type="button"
                        className="w-full text-left px-3 py-2.5 hover:bg-navy-700/60 border-b border-navy-500/20 last:border-b-0"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setCustomerQuery(
                            customer.phone
                              ? `${customer.name} • ${customer.phone}`
                              : customer.name,
                          );
                          setShowCustomerList(false);
                        }}
                      >
                        <p className="text-sm text-white font-medium">
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {customer.phone || "No phone"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
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
            <button
              onClick={handleGenerate}
              disabled={loading || savingInvoice}
              className="btn-gold flex items-center justify-center gap-2 py-2.5"
            >
              {loading || savingInvoice ? (
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
            <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
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
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setPreviewOrders(orders);
                    setPreviewMeta({
                      dateFrom,
                      dateTo,
                      customerFilter: customerQuery || null,
                      clientName: selectedCustomer
                        ? selectedCustomer.phone
                          ? `${selectedCustomer.name} (${selectedCustomer.phone})`
                          : selectedCustomer.name
                        : null,
                      clientAddress: clientAddress || null,
                    });
                    setShowPreview(true);
                  }}
                  className="btn-outline flex-1 sm:flex-none justify-center flex items-center gap-2 text-sm py-2"
                >
                  <FileText className="w-4 h-4" /> Preview
                </button>
                <button
                  onClick={() => {
                    setPreviewOrders(orders);
                    setPreviewMeta({
                      dateFrom,
                      dateTo,
                      customerFilter: customerQuery || null,
                      clientName: selectedCustomer
                        ? selectedCustomer.phone
                          ? `${selectedCustomer.name} (${selectedCustomer.phone})`
                          : selectedCustomer.name
                        : null,
                      clientAddress: clientAddress || null,
                    });
                    setShowPreview(true);
                    setTimeout(handlePrint, 300);
                  }}
                  className="btn-gold flex-1 sm:flex-none justify-center flex items-center gap-2 text-sm py-2"
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

        {/* Saved Invoices */}
        <div className="card p-6 mt-6">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div>
              <h3 className="text-white font-semibold text-sm">
                Saved Invoices
              </h3>
              <p className="text-gray-500 text-xs">
                All invoices generated and saved in Firebase
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                className="input-field text-sm py-2 pl-9"
                placeholder="Search invoice, name, phone..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="text-center py-10 text-sm text-gray-500">
              {savedInvoices.length === 0
                ? "No saved invoices yet."
                : "No invoices match your search."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-navy-500/30">
                    <th className="text-left p-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Invoice #
                    </th>
                    <th className="text-left p-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Customer
                    </th>
                    <th className="text-left p-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Period
                    </th>
                    <th className="text-right p-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Orders
                    </th>
                    <th className="text-right p-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Total
                    </th>
                    <th className="text-right p-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Created
                    </th>
                    <th className="text-right p-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-navy-500/20 hover:bg-navy-600/20 transition-colors"
                    >
                      <td className="p-3 text-xs text-gold font-mono">
                        {invoice.invoiceNo || "—"}
                      </td>
                      <td className="p-3 text-sm text-white">
                        {invoice.customerName || "—"}
                        <p className="text-xs text-gray-500 mt-0.5">
                          {invoice.customerPhone || "No phone"}
                        </p>
                      </td>
                      <td className="p-3 text-xs text-gray-400">
                        {invoice.dateFrom || "—"} → {invoice.dateTo || "—"}
                      </td>
                      <td className="p-3 text-right text-sm text-gray-400">
                        {invoice.ordersCount || 0}
                      </td>
                      <td className="p-3 text-right text-sm font-semibold text-gold">
                        ৳{(invoice.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-xs text-gray-500">
                        {invoice.createdAt?.toDate
                          ? format(invoice.createdAt.toDate(), "MMM d, yyyy")
                          : "—"}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewSavedInvoice(invoice)}
                            disabled={viewingInvoiceId === invoice.id}
                            className="inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-gold/10 text-gray-400 hover:text-gold transition-colors disabled:opacity-50"
                            title="View Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-red-900/20 text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {showPreview && previewOrders.length > 0 && (
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
              <div className="no-print sticky top-0 bg-gray-50 border-b px-4 sm:px-6 py-3 flex items-center justify-between gap-2 z-10">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  Invoice Preview — {previewOrders.length} orders
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrint()}
                    className="flex items-center gap-1.5 bg-[#0A1628] text-[#D4AF37] text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl font-medium hover:bg-[#112240] transition-colors"
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
                orders={previewOrders}
                dateFrom={previewMeta?.dateFrom || dateFrom}
                dateTo={previewMeta?.dateTo || dateTo}
                customerFilter={previewMeta?.customerFilter || null}
                clientName={previewMeta?.clientName || null}
                clientAddress={previewMeta?.clientAddress || null}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
