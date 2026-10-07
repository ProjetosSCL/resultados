import React from "react";

/**
 * Design Minimalista — Button
 * Classes: .btn, .btn-primary, .btn-secondary, .btn-ghost
 * Border-radius: 6px
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
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
    "inline-flex items-center justify-center font-medium rounded-[6px] transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:pointer-events-none select-none";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  const variants = {
    primary:
      "bg-[#2d9d6e] text-[#0f1419] font-semibold hover:bg-[#6b9b7d] hover:-translate-y-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.3)] active:translate-y-0",
    secondary:
      "bg-transparent text-[#2d9d6e] border border-[#2d9d6e] hover:bg-[#2d9d6e]/10 active:scale-98",
    outline:
      "bg-transparent text-[#2d9d6e] border border-[#2d9d6e] hover:bg-[#2d9d6e]/10 active:scale-98",
    ghost:
      "bg-transparent text-[#e8e8e8] border border-[#3a434d] hover:border-[#2d9d6e] hover:text-[#2d9d6e] hover:bg-[#2d9d6e]/5 active:scale-98",
    dark:
      "bg-[#1a1f26] text-[#e8e8e8] border border-[#3a434d] hover:border-[#2d9d6e] hover:text-[#2d9d6e] active:scale-98",
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
