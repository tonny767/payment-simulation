import PaymentsTable from "@/components/PaymentsTable";
import PaymentsSummary from "@/components/PaymentsWidget";
import { Box, Paper } from "@mui/material";

export default function Dashboard() {
  return (
    <Paper className="mx-auto max-w-7xl">
      <PaymentsTable />
      <Box className="pt-4 px-4 pb-1">
        <PaymentsSummary />
      </Box>
    </Paper>
  );
}
