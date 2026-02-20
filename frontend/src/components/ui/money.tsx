"use client";

export default function Money({
  value,
  size = "default",
}: {
  value: number | null | undefined;
  size?: "small" | "default" | "big";
}) {
  const moneyFormatter = Intl.NumberFormat("id-ID", {
    currency: "IDR",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const sizeClasses = {
    small: "text-xs",
    default: "text-sm",
    big: "text-2xl",
  };

  return (
    <p className={`bg-muted ${sizeClasses[size]}`}>
      {value != null ? moneyFormatter.format(value) : "N/A"}
    </p>
  );
}
