import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/features/auth/auth-context";
import { CircularProgress } from "@mui/material";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const doLogout = async () => {
      await logout(); // clears auth state
      navigate("/login", { replace: true });
    };
    doLogout();
  }, [logout, navigate]);

  return <CircularProgress size={40} />;
}
