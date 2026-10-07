import React from "react";

/**
 * Stone Design System — Asset de Interface (chip flutuante)
 * Tangibiliza funcionalidades/produtos sobre fotos ou fundos sólidos.
 *
 * Regras de marca:
 * - P (compacto): até 3 por peça, mesma altura entre si, nunca empilhado verticalmente.
 * - M (intermediário): até 2 por peça, mesma largura entre si, sempre em Estrutura em Bloco.
 * - G (expandido): até 2 por peça, sempre em Estrutura em Bloco.
 * - Preenchimento = heatmap 80% opacidade / contorno 2pt 90% opacidade / texto verde escuro.
 */

interface AssetChipProps {
  size?: "P" | "M" | "G";
  icon?: React.ReactNode;
  label: string;
  value?: string | number;
  className?: string;
}

export function AssetChip({
  size = "M",
  icon,
  label,
  value,
  className = "",
}: AssetChipProps) {
  const sizeStyles = {
    P: "px-3 py-1.5 text-xs sm:text-sm gap-1.5",
    M: "px-4 py-2 text-sm sm:text-base gap-2",
    G: "px-5 py-3 text-base sm:text-lg gap-2.5",
  };

  return (
    <div
      className={`inline-flex items-center rounded-stone-pill backdrop-blur-sm ${sizeStyles[size]} ${className}`}
      style={{
        backgroundImage: "var(--heatmap-greens)",
        border: "var(--asset-stroke-width) solid rgba(0,70,30,var(--asset-stroke-opacity))",
        color: "var(--color-text-on-light)",
      }}
    >
      {icon && <span className="shrink-0" aria-hidden>{icon}</span>}
      <span className="font-body font-semibold">{label}</span>
      {value !== undefined && <span className="font-body font-bold ml-1">{value}</span>}
    </div>
  );
}
