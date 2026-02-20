import PaymentsTable from "@/components/PaymentsTable";
import { Paper, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Content */}

      <Paper className="mx-auto mt-6 max-w-7xl">
        <Typography variant="h5" sx={{ p: 2, fontWeight: "semi-bold" }}>
          Payments
        </Typography>
        <PaymentsTable />
      </Paper>
    </div>
  );
}
