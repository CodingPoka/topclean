import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#112240",
            color: "#e8e8e8",
            border: "1px solid rgba(212,175,55,0.2)",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#D4AF37", secondary: "#0A1628" } },
        }}
      />
    </AuthProvider>
  </StrictMode>,
);
