import React from "react";

/**
 * Stone Design System — Typography
 * Display = Gravity (títulos/grandes formatos) | Body = Roobert (parágrafos, UI)
 *
 * Regra de marca: na "forma fixa", use peso único por composição (não misture
 * pesos dentro de uma mesma frase). Na "forma variável", só em caixa alta,
 * no máximo 2 pesos por frase.
 */

const displayWidths: Record<string, string> = {
  compressed: "tracking-tighter",
  condensed: "tracking-tight",
  normal: "tracking-normal",
  extended: "tracking-wide",
};

interface DisplayProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  width?: "compressed" | "condensed" | "normal" | "extended";
  uppercase?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Display({
  as: Tag = "h1",
  width = "condensed",
  uppercase = true,
  className = "",
  children,
  ...props
}: DisplayProps) {
  return (
    <Tag
      className={`font-display font-bold leading-[0.95] ${
        uppercase ? "uppercase" : "capitalize"
      } ${displayWidths[width] || ""} ${className}`}
      style={{ fontFamily: "var(--font-display)" }}
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
    lg: "text-lg",
    md: "text-base",
    sm: "text-sm",
    caption: "text-xs",
  };
  return (
    <Tag
      className={`font-body ${weightMap[weight]} ${sizeMap[size]} ${className}`}
      style={{ fontFamily: "var(--font-body)" }}
      {...props}
    >
      {children}
    </Tag>
  );
}
