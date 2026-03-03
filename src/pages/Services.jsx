import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import ServiceModal from "../components/services/ServiceModal";
import { getServices, deleteService } from "../firebase/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, ImageOff, Settings } from "lucide-react";
import toast from "react-hot-toast";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchServices = () => {
    setLoading(true);
    getServices()
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (svc) => {
    setEditData(svc);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await deleteService(id);
    fetchServices();
    toast.success("Service deleted");
  };

  return (
    <Layout title="Services">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-sm">
            {services.length} services available
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="btn-gold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card p-4 h-52 animate-pulse bg-navy-700" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="card p-16 text-center">
          <Settings className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            No services yet. Add your first service to get started.
          </p>
          <button
            onClick={handleAdd}
            className="btn-gold mt-4 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {services.map((svc, i) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="card overflow-hidden hover:border-gold/30 hover:shadow-gold transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-36 bg-navy-800 overflow-hidden">
                  {svc.imageUrl ? (
                    <img
                      src={svc.imageUrl}
                      alt={svc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="w-8 h-8 text-gray-700" />
                    </div>
                  )}
                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(svc)}
                      className="p-2 bg-gold rounded-xl hover:bg-gold-light transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-navy-900" />
                    </button>
                    <button
                      onClick={() => handleDelete(svc.id, svc.name)}
                      className="p-2 bg-red-500 rounded-xl hover:bg-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm mb-0.5 truncate">
                    {svc.name}
                  </h3>
                  {svc.description && (
                    <p className="text-gray-500 text-xs truncate mb-2">
                      {svc.description}
                    </p>
                  )}
                  <p className="text-gold font-bold text-base">
                    ৳{svc.price?.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ServiceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSaved={fetchServices}
        editData={editData}
      />
    </Layout>
  );
}
