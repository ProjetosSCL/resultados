import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  badge?: string;
}

/**
 * Card compacto (estilo "Weekly Revenue"): ícone, rótulo, valor grande e badge verde.
 */
export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, badge }) => (
  <div className="flex items-center gap-4 rounded-q-card bg-q-card p-5">
    <div className="grid size-12 shrink-0 place-items-center rounded-full bg-q-green-tint text-q-green">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <span className="block text-xs font-medium text-q-muted">{label}</span>
      <span className="block truncate text-xl font-extrabold tracking-tight text-q-ink">
        {value}
      </span>
    </div>
    {badge && (
      <span className="shrink-0 rounded-full bg-q-green px-2.5 py-1 text-[11px] font-bold text-white">
        {badge}
      </span>
    )}
  </div>
);
