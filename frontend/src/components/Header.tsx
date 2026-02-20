import { useAuth } from "@/features/auth/auth-context.tsx";
import Button from "@mui/material/Button";

export default function Header() {
  const { role, logout } = useAuth();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Payment Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Role: {role}</span>

        <Button variant="contained" color="error" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
