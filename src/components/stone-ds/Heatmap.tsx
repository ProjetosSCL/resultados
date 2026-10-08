import React from "react";

/**
 * Design Minimalista — Ambient Backdrop
 * Efeito sutil de profundidade sem gradientes saturados
 */

interface HeatmapProps extends React.HTMLAttributes<HTMLElement> {
  palette?: "greens" | "secondary";
  as?: React.ElementType;
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Heatmap({
  as: Tag = "div",
  className = "",
  children,
  ...props
}: HeatmapProps) {
  return (
    <Tag
      className={`relative overflow-hidden bg-gradient-to-b from-[#1a1f26] to-[#0f1419] ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
