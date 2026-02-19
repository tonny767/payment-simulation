import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppLayout } from "@/components/AppLayout.tsx";
import { AuthProvider } from "@/features/auth/auth-context.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <StrictMode>
      <AppLayout />
    </StrictMode>
  </AuthProvider>
);
