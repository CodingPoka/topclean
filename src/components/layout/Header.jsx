import { useAuth } from "../../context/AuthContext";
import { Bell, User } from "lucide-react";

export default function Header({ title }) {
  const { user } = useAuth();

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-navy-500/30 bg-navy-800/60 backdrop-blur-sm sticky top-0 z-20">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-xs text-gray-500">{dateStr}</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl hover:bg-navy-700 text-gray-400 hover:text-gray-200 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-navy-500/30">
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
