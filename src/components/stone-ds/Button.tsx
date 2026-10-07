import React from "react";

/**
 * Stone Design System — Button
 * Variants: primary (verde sólido), hover (heatmap), outline, dark
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-body font-semibold rounded-stone-pill transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-green-dark disabled:opacity-40 disabled:pointer-events-none cursor-pointer";

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg",
  };

  const variants = {
    primary:
      "bg-stone-green text-stone-green-dark hover:bg-stone-heatmap hover:bg-cover shadow-sm active:scale-95",
    dark: "bg-stone-green-dark text-stone-green hover:opacity-90 active:scale-95",
    outline:
      "bg-transparent border-2 border-stone-green text-stone-green hover:bg-stone-green/10 active:scale-95",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
