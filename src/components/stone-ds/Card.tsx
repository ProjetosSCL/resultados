import React from "react";

/**
 * Card Quixotic — superfície branca, raio grande, sem borda.
 * (A prop `tone` é mantida só por compatibilidade e é ignorada.)
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: "principal" | "respiro" | "semMoldura";
  tone?: "green" | "dark" | "light" | "surface" | "black";
  className?: string;
  children?: React.ReactNode;
}

export function Card({
  layout = "principal",
  tone: _tone,
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
      className={`rounded-q-card bg-q-card ${layoutStyles[layout] || ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
