"use client";
import { Chip } from "@mui/material";
export default function StatusChip({ status }: { status: string }) {
  const color = status === "completed" ? "success" : status === "failed" ? "error" : "warning";

  return <Chip label={status} color={color} size="small" />;
}
