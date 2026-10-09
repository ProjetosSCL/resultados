import React from "react";
import { Calendar, RefreshCw, Tv, ChevronDown } from "lucide-react";
import { formatMonthDisplay } from "../services/supabaseService";

interface PageHeadProps {
  selectedMonth: string;
  displayMonth: string;
  availableMonths: string[];
  onSelectMonth: (month: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  onStartPresentation?: () => void;
}

const pillBase =
  "inline-flex items-center gap-2.5 rounded-full bg-q-card px-5 py-3 text-sm font-semibold text-q-ink border border-q-line shadow-xs";

/**
 * Título da página + ações (seletor dos meses publicados no Supabase, atualizar dados e modo apresentação).
 */
export const PageHead: React.FC<PageHeadProps> = ({
  selectedMonth,
  displayMonth,
  availableMonths,
  onSelectMonth,
  onRefresh,
  isLoading,
  onStartPresentation,
}) => {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 px-2 pt-8 pb-6 sm:px-4 sm:pt-10 sm:pb-8">
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-q-ink sm:text-4xl m-0">
          Resultados de <span className="font-extrabold text-q-green">{displayMonth || "Carregando..."}</span>
        </h1>
        <p className="m-0 mt-1 text-xs font-semibold text-q-muted">
          Painel de performance técnica das operações e Green Angels
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {onStartPresentation && (
          <button
            onClick={onStartPresentation}
            title="Iniciar Apresentação para Reunião ao Vivo"
            className="inline-flex items-center gap-2 rounded-full bg-q-green px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-q-green-deep cursor-pointer"
          >
            <Tv className="size-4" strokeWidth={2.2} />
            <span>Modo Apresentação</span>
          </button>
        )}

        {/* Seletor de mês publicado no Supabase */}
        <div className="relative inline-flex items-center rounded-full bg-q-card px-4 py-2.5 text-sm font-bold text-q-ink border border-q-line hover:border-q-green transition-colors shadow-xs">
          <Calendar className="size-4 text-q-green shrink-0 mr-2" strokeWidth={2.2} />
          <select
            value={selectedMonth}
            onChange={(e) => onSelectMonth(e.target.value)}
            disabled={isLoading || availableMonths.length === 0}
            aria-label="Mês de referência"
            className="cursor-pointer bg-transparent pr-6 font-bold text-q-ink focus:outline-none appearance-none"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m} className="font-semibold text-q-ink bg-white">
                {formatMonthDisplay(m)}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 size-4 text-q-muted" strokeWidth={2.2} />
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          title="Recarregar dados do banco Supabase"
          className={`${pillBase} cursor-pointer transition-colors hover:bg-q-green-tint disabled:opacity-50`}
        >
          <RefreshCw
            className={`size-4 ${isLoading ? "animate-spin text-q-green" : ""}`}
            strokeWidth={2.2}
          />
          <span>Atualizar dados</span>
        </button>
      </div>
    </div>
  );
};
