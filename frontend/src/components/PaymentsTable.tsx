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
  Typography,
  Box,
  TableFooter,
  TablePagination,
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

  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const sortParam = (sortDirection === "desc" && !!sortField ? "-" : "") + sortField;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments", status, sortParam, page, rowsPerPage],
    queryFn: () =>
      fetchPayments({
        status: status || undefined,
        sort: sortParam || undefined,
        page: page + 1,
        limit: rowsPerPage,
      }),
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading)
    return (
      <Paper className="p-3 text-center">
        <CircularProgress />
      </Paper>
    );

  if (isError) return <Paper className="p-3">Failed to load payments</Paper>;

  const payments = data?.payments || [];

  return (
    <Stack spacing={2}>
      {/* Table */}
      <Paper>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
          <Typography variant="h5" fontWeight={600}>
            Payments
          </Typography>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => {
                setStatus(e.target.value as typeof status);
                setPage(0);
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
          <TableFooter>
            <TableRow>
              <TablePagination
                page={page}
                count={data?.total || 0}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    </Stack>
  );
}
