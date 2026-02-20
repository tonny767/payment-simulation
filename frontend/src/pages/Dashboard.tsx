import PaymentsTable from "@/components/PaymentsTable";
import PaymentsSummary from "@/components/PaymentsWidget";
import { Box, Paper } from "@mui/material";

export default function Dashboard() {
  return (
    <Paper className="min-h-screen mx-auto mt-6 max-w-7xl">
      <PaymentsTable />
      <Box className="p-4">
        <PaymentsSummary />
      </Box>
    </Paper>
  );
}
