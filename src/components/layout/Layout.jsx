import Sidebar from "./Sidebar";
import Header from "./Header";
import { motion } from "framer-motion";

export default function Layout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-navy-900">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header title={title} />
        <motion.main
          key={title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6 overflow-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
