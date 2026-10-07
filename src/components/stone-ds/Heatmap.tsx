import React from "react";

/**
 * Stone Design System — Heatmap
 * O elemento assinatura da marca: gradiente orgânico animado.
 *
 * Uso: fundo | máscara de recorte (via bg-clip-text) | fundo de botão.
 * Regra: garantir sempre contraste de texto; nunca usar como fundo de título inteiro/frase longa.
 */

interface HeatmapProps extends React.HTMLAttributes<HTMLElement> {
  palette?: "greens" | "secondary";
  as?: React.ElementType;
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Heatmap({
  palette = "greens",
  as: Tag = "div",
  animated = true,
  className = "",
  children,
  ...props
}: HeatmapProps) {
  const bg =
    palette === "secondary" ? "var(--heatmap-secondary)" : "var(--heatmap-greens)";

  return (
    <Tag
      className={`relative overflow-hidden ${
        animated ? "animate-[stone-heatmap_12s_ease-in-out_infinite]" : ""
      } ${className}`}
      style={{ backgroundImage: bg, backgroundSize: "180% 180%" }}
      {...props}
    >
      {children}
    </Tag>
  );
}
