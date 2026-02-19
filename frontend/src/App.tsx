import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useAuth } from "@/features/auth/auth-context";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Unauthorized from "@/pages/Unauthorized";
import AppLayout from "@/components/AppLayout";
import Logout from "@/pages/Logout";
import NotFound from "@/pages/NotFound";
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route path="/logout" element={<Logout />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
