import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableSortLabel,
} from "@mui/material";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPayments } from "@/features/payment/api";
import StatusChip from "@/components/ui/status-chip";
import type { Payment } from "@/features/payment/types";
import Money from "@/components/ui/money";

type SortField = "amount" | "created_at" | "";

export default function PaymentsTable() {
  const [status, setStatus] = useState<"completed" | "processing" | "failed" | "">("");

  const [sortField, setSortField] = useState<SortField>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortParam = (sortDirection === "desc" && !!sortField ? "-" : "") + sortField;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments", status, sortParam],
    queryFn: () =>
      fetchPayments({
        status: status || undefined,
        sort: sortParam || undefined,
      }),
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (isLoading)
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Paper>
    );

  if (isError) return <Paper sx={{ p: 3 }}>Failed to load payments</Paper>;

  const payments = data?.data?.payments || [];

  return (
    <Stack spacing={2}>
      {/* Table */}
      <Paper>
        <FormControl size="small" sx={{ minWidth: 200, marginLeft: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FormControl>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Merchant</TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortField === "amount"}
                  direction={sortDirection}
                  onClick={() => handleSort("amount")}
                >
                  Amount
                </TableSortLabel>
              </TableCell>

              <TableCell>Status</TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortField === "created_at"}
                  direction={sortDirection}
                  onClick={() => handleSort("created_at")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments.map((payment: Payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.merchant}</TableCell>
                <TableCell>
                  <Money value={payment.amount} />
                </TableCell>
                <TableCell>
                  <StatusChip status={payment.status} />
                </TableCell>
                <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
