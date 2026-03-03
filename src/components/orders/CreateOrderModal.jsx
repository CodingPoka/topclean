import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, Search } from "lucide-react";
import { getServices, createOrder } from "../../firebase/helpers";
import toast from "react-hot-toast";

export default function CreateOrderModal({ open, onClose, onCreated }) {
  const [services, setServices] = useState([]);
  const [customer, setCustomer] = useState({ name: "", room: "", phone: "" });
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) getServices().then(setServices).catch(console.error);
  }, [open]);

  const filtered = services.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (svc) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === svc.id);
      if (exist)
        return prev.map((i) =>
          i.id === svc.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { ...svc, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handleSubmit = async () => {
    if (!customer.name.trim()) return toast.error("Customer name is required");
    if (!customer.room.trim()) return toast.error("Room number is required");
    if (cart.length === 0) return toast.error("Add at least one service");

    setLoading(true);
    try {
      const orderId = await createOrder({
        customerName: customer.name.trim(),
        roomNumber: customer.room.trim(),
        phone: customer.phone.trim(),
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        total,
        note: note.trim(),
        receiptNo: `TC-${Date.now().toString().slice(-6)}`,
      });
      toast.success("Order created successfully!");
      onCreated?.(orderId);
      handleClose();
    } catch (e) {
      toast.error("Failed to create order");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCustomer({ name: "", room: "", phone: "" });
    setCart([]);
    setSearch("");
    setNote("");
    onClose?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl card shadow-gold-lg border border-gold/10 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-navy-500/30">
              <div>
                <h2 className="text-lg font-semibold text-white">New Order</h2>
                <p className="text-gray-500 text-sm">
                  Create order & generate receipt
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-navy-600 rounded-xl text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left: Customer + Services */}
              <div className="flex-1 p-6 overflow-y-auto border-r border-navy-500/30 space-y-5">
                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gold mb-3">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Full Name *
                      </label>
                      <input
                        className="input-field text-sm py-2"
                        placeholder="John Doe"
                        value={customer.name}
                        onChange={(e) =>
                          setCustomer({ ...customer, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Room No. *
                      </label>
                      <input
                        className="input-field text-sm py-2"
                        placeholder="501"
                        value={customer.room}
                        onChange={(e) =>
                          setCustomer({ ...customer, room: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Phone
                      </label>
                      <input
                        className="input-field text-sm py-2"
                        placeholder="+880..."
                        value={customer.phone}
                        onChange={(e) =>
                          setCustomer({ ...customer, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Service Search */}
                <div>
                  <h3 className="text-sm font-semibold text-gold mb-3">
                    Select Services
                  </h3>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      className="input-field pl-9 text-sm py-2"
                      placeholder="Search services..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    {filtered.map((svc) => (
                      <button
                        key={svc.id}
                        onClick={() => addToCart(svc)}
                        className="flex items-center justify-between p-3 rounded-xl bg-navy-800 border border-navy-500/40
                                   hover:border-gold/40 hover:bg-navy-800/80 transition-all duration-200 text-left group"
                      >
                        <div className="flex items-center gap-2">
                          {svc.imageUrl && (
                            <img
                              src={svc.imageUrl}
                              alt={svc.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          )}
                          <span className="text-sm text-white">{svc.name}</span>
                        </div>
                        <span className="text-gold text-sm font-semibold">
                          ৳{svc.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Note (optional)
                  </label>
                  <textarea
                    className="input-field text-sm py-2 h-16 resize-none"
                    placeholder="Special instructions..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              {/* Right: Cart */}
              <div className="w-72 p-6 flex flex-col">
                <h3 className="text-sm font-semibold text-gold mb-4">
                  Order Summary
                </h3>

                {cart.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <p className="text-gray-600 text-sm">
                      No services added yet.
                      <br />
                      Click services to add.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-navy-800 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white font-medium">
                            {item.name}
                          </span>
                          <button
                            onClick={() =>
                              setCart(cart.filter((i) => i.id !== item.id))
                            }
                            className="text-gray-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => changeQty(item.id, -1)}
                              className="w-6 h-6 rounded-lg bg-navy-600 hover:bg-navy-500 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3 text-gray-300" />
                            </button>
                            <span className="text-sm font-semibold text-white w-4 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => changeQty(item.id, 1)}
                              className="w-6 h-6 rounded-lg bg-navy-600 hover:bg-navy-500 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3 text-gray-300" />
                            </button>
                          </div>
                          <span className="text-gold text-sm font-semibold">
                            ৳{(item.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-navy-500/30 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-gold">৳{total.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-gold w-full flex items-center justify-center gap-2 py-3"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-navy-900/40 border-t-navy-900 rounded-full animate-spin" />
                    ) : (
                      "Create Order & Receipt"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
