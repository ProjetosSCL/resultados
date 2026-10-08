import React from "react";

/**
 * Chip Quixotic — pill pequeno para rótulos, medalhas e status.
 */
interface AssetChipProps {
  size?: "P" | "M" | "G";
  icon?: React.ReactNode;
  label: string;
  value?: string | number;
  variant?: "success" | "warning" | "silver" | "bronze" | "info" | "neutral" | "onGreen";
  className?: string;
}

export function AssetChip({
  icon,
  label,
  value,
  variant = "success",
  className = "",
}: AssetChipProps) {
  const variantStyles = {
    success: "bg-q-green-tint text-q-green-deep",
    warning: "bg-[#fbf3d4] text-[#7a5c00]",
    silver: "bg-q-soft text-[#55555b]",
    bronze: "bg-[#f8e6dc] text-[#9a5330]",
    info: "bg-[#e3eefc] text-[#1f5aa6]",
    neutral: "bg-q-soft text-q-muted",
    onGreen: "bg-white/15 text-white",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0 text-current">{icon}</span>}
      <span>{label}</span>
      {value !== undefined && <span className="ml-0.5 font-extrabold">{value}</span>}
    </span>
  );
}
