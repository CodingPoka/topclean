import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2 } from "lucide-react";
import { addService, updateService } from "../../firebase/helpers";
import toast from "react-hot-toast";

// Cloudinary credentials loaded from environment variables
const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

export default function ServiceModal({ open, onClose, onSaved, editData }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        price: editData.price?.toString() || "",
        description: editData.description || "",
        imageUrl: editData.imageUrl || "",
      });
    } else {
      setForm({ name: "", price: "", description: "", imageUrl: "" });
    }
  }, [editData, open]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", CLOUDINARY_PRESET);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
        {
          method: "POST",
          body: fd,
        },
      );
      const data = await res.json();
      if (data.secure_url) {
        setForm((f) => ({ ...f, imageUrl: data.secure_url }));
        toast.success("Image uploaded!");
      } else {
        toast.error("Upload failed. Check Cloudinary config.");
      }
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error("Service name is required");
    if (!form.price || isNaN(Number(form.price)))
      return toast.error("Valid price is required");

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        imageUrl: form.imageUrl,
      };
      if (editData?.id) {
        await updateService(editData.id, payload);
        toast.success("Service updated!");
      } else {
        await addService(payload);
        toast.success("Service added!");
      }
      onSaved?.();
      onClose?.();
    } catch (e) {
      toast.error("Failed to save service");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md card shadow-gold-lg border border-gold/10 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">
                {editData ? "Edit Service" : "Add New Service"}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-navy-600 rounded-xl text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-xs text-gray-400 block mb-1.5">
                  Service Image
                </label>
                <div className="flex items-center gap-3">
                  {form.imageUrl ? (
                    <img
                      src={form.imageUrl}
                      alt="preview"
                      className="w-16 h-16 rounded-xl object-cover border border-navy-500/40"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-navy-800 border border-navy-500/40 border-dashed flex items-center justify-center">
                      <Upload className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                  <label className="btn-outline text-xs py-2 cursor-pointer flex items-center gap-1.5">
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploading ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1.5">
                  Service Name *
                </label>
                <input
                  className="input-field text-sm"
                  placeholder="e.g. Shirt Wash & Press"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1.5">
                  Price (SDG) *
                </label>
                <input
                  className="input-field text-sm"
                  type="number"
                  min={0}
                  placeholder="150"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1.5">
                  Description
                </label>
                <textarea
                  className="input-field text-sm h-20 resize-none"
                  placeholder="Brief description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="btn-outline flex-1 text-sm py-2.5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="btn-gold flex-1 text-sm py-2.5 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editData ? (
                    "Update Service"
                  ) : (
                    "Add Service"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
