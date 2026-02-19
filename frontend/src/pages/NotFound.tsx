import { Button } from "@mui/material";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-bold text-red-600">Page Not Found</h1>
      <p className="mt-2 text-gray-600">The page you are looking for does not exist.</p>
      <div className="mt-4">
        <Button variant="outlined" onClick={() => navigate("/")}>
          Back to Home
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate("/logout")}
          className="ml-4"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
