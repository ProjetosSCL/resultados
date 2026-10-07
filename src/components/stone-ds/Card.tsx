import React from "react";

/**
 * Stone Design System — Card
 * Suporta os 3 layouts da marca: principal (margem fina), respiro (margem larga),
 * sem moldura (full-bleed). tone controla o fundo.
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: "principal" | "respiro" | "semMoldura";
  tone?: "green" | "dark" | "light" | "surface" | "black";
  className?: string;
  children?: React.ReactNode;
}

export function Card({
  layout = "principal",
  tone = "dark",
  className = "",
  children,
  ...props
}: CardProps) {
  const layoutStyles: Record<string, string> = {
    principal: "p-5 sm:p-[30px]",
    respiro: "p-8 sm:p-[60px]",
    semMoldura: "p-0",
  };

  const toneStyles: Record<string, string> = {
    green: "bg-stone-green text-stone-green-dark border border-stone-green-vibrant/40",
    dark: "bg-stone-green-dark text-stone-gray-0 border border-stone-green-vibrant/20",
    light: "bg-stone-gray-0 text-stone-green-dark border border-stone-gray-1",
    surface: "bg-stone-black text-stone-gray-0 border border-stone-gray-3/30",
    black: "bg-stone-black text-stone-green-vibrant border border-stone-green-dark-2",
  };

  return (
    <div
      className={`rounded-stone-lg ${layoutStyles[layout] || ""} ${
        toneStyles[tone] || ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
