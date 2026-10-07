import React from "react";

/**
 * Design Minimalista — Badge
 * Classes: .badge, .badge-success, .badge-warning, .badge-info
 * Radius: 4px
 */

interface AssetChipProps {
  size?: "P" | "M" | "G";
  icon?: React.ReactNode;
  label: string;
  value?: string | number;
  variant?: "success" | "warning" | "silver" | "bronze" | "info" | "neutral";
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
    success: "bg-[#2d9d6e]/15 text-[#2d9d6e] border-[#2d9d6e]/30",
    warning: "bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]/30",
    silver: "bg-[#b0b0b0]/15 text-[#b0b0b0] border-[#b0b0b0]/30",
    bronze: "bg-[#c87d55]/15 text-[#c87d55] border-[#c87d55]/30",
    info: "bg-[rgba(33,150,243,0.15)] text-[#2196f3] border-[rgba(33,150,243,0.3)]",
    neutral: "bg-[#242b33] text-[#b0b0b0] border-[#3a434d]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-xs font-medium border transition-all duration-300 ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0 text-current">{icon}</span>}
      <span>{label}</span>
      {value !== undefined && <span className="font-semibold ml-0.5">{value}</span>}
    </span>
  );
}
