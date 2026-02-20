"use client";

export default function Money({ value }: { value: number | null | undefined }) {
  const moneyFormatter = Intl.NumberFormat("id-ID", {
    currency: "IDR",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return <p className="bg-muted text-sm">{value != null ? moneyFormatter.format(value) : "N/A"}</p>;
}
