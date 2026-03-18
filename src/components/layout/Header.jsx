import { useAuth } from "../../context/AuthContext";
import { Bell, User, Menu } from "lucide-react";

export default function Header({ title, onMenuClick }) {
  const { user } = useAuth();

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-navy-500/30 bg-navy-800/60 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-navy-700 text-gray-300 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-white truncate">
            {title}
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-500 truncate">
            {dateStr}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2 rounded-xl hover:bg-navy-700 text-gray-400 hover:text-gray-200 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-navy-500/30">
          <div className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
            <User className="w-4 h-4 text-gold" />
          </div>
          <div>
            <p className="text-sm font-medium text-white leading-none">Admin</p>
            <p className="text-xs text-gray-500 leading-none mt-0.5">
              {user?.email?.split("@")[0] || "admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
