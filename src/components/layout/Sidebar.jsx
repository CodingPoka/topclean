import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  FileText,
  ClipboardList,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/invoice", icon: ClipboardList, label: "Invoices" },
  { to: "/services", icon: Settings, label: "Services" },
  { to: "/reports", icon: FileText, label: "Reports" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed left-0 top-0 h-full w-64 bg-navy-800 border-r border-navy-500/30 flex flex-col z-30"
    >
      {/* Brand */}
      <div className="p-6 border-b border-navy-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center overflow-hidden">
            <img
              src="/logot.png"
              alt="Top Clean Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <p className="font-display font-bold text-white text-lg leading-tight">
              Top Clean
            </p>
            <p className="text-xs text-gold/70 tracking-widest uppercase">
              Laundry
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${
                isActive
                  ? "bg-gold/15 border border-gold/30 text-gold"
                  : "text-gray-400 hover:bg-navy-700 hover:text-gray-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-gold" : "group-hover:text-gray-200"}`}
                />
                <span className="font-medium text-sm">{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Version / logout */}
      <div className="p-4 border-t border-navy-500/30">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
        <p className="text-xs text-gray-600 text-center mt-3">
          v1.0.0 • Admin Panel
        </p>
      </div>
    </motion.aside>
  );
}
