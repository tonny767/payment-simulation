import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-context";
import type { PropsWithChildren } from "react";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
