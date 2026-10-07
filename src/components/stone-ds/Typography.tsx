import React from "react";

/**
 * Design Minimalista — Typography
 * Font: 'Segoe UI', 'Roboto', sans-serif
 */

interface DisplayProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  width?: "compressed" | "condensed" | "normal" | "extended";
  uppercase?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Display({
  as: Tag = "h1",
  uppercase = false,
  className = "",
  children,
  ...props
}: DisplayProps) {
  return (
    <Tag
      className={`font-semibold tracking-tight text-[#e8e8e8] ${
        uppercase ? "uppercase" : ""
      } ${className}`}
      style={{ fontFamily: "'Segoe UI', 'Roboto', -apple-system, sans-serif" }}
      {...props}
    >
      {children}
    </Tag>
  );
}

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  weight?: "regular" | "medium" | "semibold" | "bold";
  size?: "lg" | "md" | "sm" | "caption";
  className?: string;
  children?: React.ReactNode;
}

export function Text({
  as: Tag = "p",
  weight = "regular",
  size = "md",
  className = "",
  children,
  ...props
}: TextProps) {
  const weightMap: Record<string, string> = {
    regular: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };
  const sizeMap: Record<string, string> = {
    lg: "text-base",
    md: "text-sm",
    sm: "text-xs",
    caption: "text-[11px]",
  };
  return (
    <Tag
      className={`text-[#b0b0b0] ${weightMap[weight]} ${sizeMap[size]} leading-relaxed ${className}`}
      style={{ fontFamily: "'Segoe UI', 'Roboto', -apple-system, sans-serif" }}
      {...props}
    >
      {children}
    </Tag>
  );
}
