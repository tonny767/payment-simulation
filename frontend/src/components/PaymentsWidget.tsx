import { Grid, Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import Money from "./ui/money";
import { useQuery } from "@tanstack/react-query";
import { fetchPaymentSummary } from "@/features/payment/api";

export default function StatusSummary() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPaymentSummary,
  });
  const summary = data;
  if (!summary) {
    return (
      <Box className="p-3 text-center">
        <Typography>No data</Typography>
      </Box>
    );
  }
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="p-3 text-center">
        <Typography>Failed to load summary</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} mb={3}>
      {/* Total */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Total Payments
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {summary.total}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="subtitle2" color="success.main">
              Completed
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {summary.completed}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="subtitle2" color="warning.main">
              Processing
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {summary.processing}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="subtitle2" color="error.main">
              Failed
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="error.main">
              {summary.failed}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Total Amount
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              <Money value={summary.total_amount} size="big" />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
