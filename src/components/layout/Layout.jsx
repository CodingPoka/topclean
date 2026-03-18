import Sidebar from "./Sidebar";
import Header from "./Header";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Layout({ children, title }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-navy-900">
      <Sidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen min-w-0">
        <Header title={title} onMenuClick={() => setMobileSidebarOpen(true)} />
        <motion.main
          key={title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-4 sm:p-6 overflow-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
