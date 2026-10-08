import React from "react";

/**
 * Botão Quixotic — formato pill.
 * Variantes: primary (verde), secondary/outline (branco com borda),
 * ghost (cinza claro), dark (preto) e onGreen (branco, para usar sobre o verde).
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark" | "onGreen";
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
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 cursor-pointer select-none disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-q-green";

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    primary: "bg-q-green text-white hover:bg-q-green-deep",
    secondary: "bg-q-card text-q-ink border border-q-line hover:bg-q-green-tint",
    outline: "bg-q-card text-q-ink border border-q-line hover:bg-q-green-tint",
    ghost: "bg-q-soft text-q-ink hover:bg-q-line",
    dark: "bg-q-ink text-white hover:bg-black/80",
    onGreen: "bg-white text-q-green-deep hover:bg-q-green-tint",
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
