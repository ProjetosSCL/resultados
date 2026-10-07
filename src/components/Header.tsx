import React from "react";
import { Award, Building2, UserCheck } from "lucide-react";
import { ViewMode } from "../types";

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isLoading: boolean;
  isUsingSampleData: boolean;
}

const MODES: { key: ViewMode; label: string; Icon: typeof Building2 }[] = [
  { key: "OPERACOES", label: "Operações", Icon: Building2 },
  { key: "ANGELS", label: "Green Angels", Icon: UserCheck },
];

/**
 * Barra superior no estilo Quixotic: pill branca com logo, switcher
 * Operações / Green Angels (nav2) e chip de status da planilha.
 */
export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  isLoading,
  isUsingSampleData,
}) => {
  const statusLabel = isLoading
    ? "Sincronizando…"
    : isUsingSampleData
      ? "Dados de amostra"
      : "Planilha conectada";
  const dotClass = isLoading
    ? "bg-q-muted animate-pulse"
    : isUsingSampleData
      ? "bg-[#FF8232]"
      : "bg-q-green";

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-[40px] bg-q-card px-4 py-3 sm:px-6">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="grid size-10 place-items-center rounded-full bg-q-green text-white">
          <Award className="size-5" strokeWidth={2.4} />
        </div>
        <span className="hidden text-xl font-extrabold tracking-tight text-q-green sm:block">
          Resultados
        </span>
      </div>

      {/* nav2: switcher de visão */}
      <nav
        aria-label="Visão"
        className="order-3 flex w-full justify-center sm:order-none sm:w-auto"
      >
        <div className="inline-flex rounded-full bg-q-soft p-1.5">
          {MODES.map(({ key, label, Icon }) => {
            const active = viewMode === key;
            return (
              <button
                key={key}
                onClick={() => onViewModeChange(key)}
                aria-current={active ? "page" : undefined}
                className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5 ${
                  active
                    ? "bg-q-card text-q-ink shadow-[0_1px_2px_rgb(0_0_0/0.06)]"
                    : "text-q-muted hover:text-q-ink"
                }`}
              >
                <Icon className="size-4" strokeWidth={2.2} />
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Status da planilha */}
      <div className="flex items-center gap-2 rounded-full border border-q-line bg-q-card px-4 py-2 text-xs font-semibold text-q-ink">
        <span className={`size-2 rounded-full ${dotClass}`} />
        {statusLabel}
      </div>
    </header>
  );
};
