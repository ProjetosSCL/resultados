import React from "react";

/**
 * Design Minimalista — Card
 * Background: #1a1f26
 * Border: #3a434d
 * Radius: 8px
 * Hover: border #2d9d6e, bg #242b33
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: "principal" | "respiro" | "semMoldura";
  tone?: "green" | "dark" | "light" | "surface" | "black";
  className?: string;
  children?: React.ReactNode;
}

export function Card({
  layout = "principal",
  className = "",
  children,
  ...props
}: CardProps) {
  const layoutStyles: Record<string, string> = {
    principal: "p-5 sm:p-6",
    respiro: "p-6 sm:p-8",
    semMoldura: "p-0",
  };

  return (
    <div
      className={`bg-[#1a1f26] border border-[#3a434d] rounded-[8px] transition-all duration-300 hover:border-[#2d9d6e] hover:bg-[#242b33]/90 shadow-[0_2px_8px_rgba(0,0,0,0.3)] ${
        layoutStyles[layout] || ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
