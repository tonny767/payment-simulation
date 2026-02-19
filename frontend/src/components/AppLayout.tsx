import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/auth/auth-context";
import Header from "@/components/Header";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div>
      <div className="flex min-h-screen">
        <main className="flex-1 bg-gray-50">
          <Header />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
