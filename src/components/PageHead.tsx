import React, { useState } from "react";
import { Calendar, Check, ChevronDown, RefreshCw } from "lucide-react";

interface PageHeadProps {
  referenceMonth: string;
  onReferenceMonthChange: (month: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const MONTH_PRESETS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const pillBase =
  "inline-flex items-center gap-2.5 rounded-full bg-q-card px-5 py-3 text-sm font-semibold text-q-ink";

/**
 * Título da página + ações (mês de referência editável e atualizar dados).
 */
export const PageHead: React.FC<PageHeadProps> = ({
  referenceMonth,
  onReferenceMonthChange,
  onRefresh,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(referenceMonth);

  const save = () => {
    if (temp.trim()) onReferenceMonthChange(temp.trim());
    setIsEditing(false);
  };

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 px-2 pt-8 pb-6 sm:px-4 sm:pt-10 sm:pb-8">
      <h1 className="text-3xl font-medium tracking-tight text-q-ink sm:text-4xl">
        Resultados de <span className="font-light text-q-muted">{referenceMonth}</span>
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        {isEditing ? (
          <div className={`${pillBase} ring-2 ring-q-green`}>
            <Calendar className="size-4" strokeWidth={2} />
            <input
              type="text"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && save()}
              autoFocus
              list="q-months-list"
              aria-label="Mês de referência"
              className="w-28 bg-transparent font-semibold focus:outline-none"
            />
            <datalist id="q-months-list">
              {MONTH_PRESETS.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            <button
              onClick={save}
              title="Salvar mês"
              className="cursor-pointer text-q-green"
            >
              <Check className="size-4" strokeWidth={2.6} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setTemp(referenceMonth);
              setIsEditing(true);
            }}
            title="Clique para editar o mês de referência"
            className={`${pillBase} cursor-pointer transition-colors hover:bg-q-green-tint`}
          >
            <Calendar className="size-4" strokeWidth={2} />
            {referenceMonth}
            <ChevronDown className="size-4 text-q-muted" strokeWidth={2} />
          </button>
        )}

        <button
          onClick={onRefresh}
          disabled={isLoading}
          title="Recarregar dados da planilha Google Sheets"
          className={`${pillBase} cursor-pointer transition-colors hover:bg-q-green-tint disabled:opacity-50`}
        >
          <RefreshCw
            className={`size-4 ${isLoading ? "animate-spin text-q-green" : ""}`}
            strokeWidth={2.2}
          />
          Atualizar dados
        </button>
      </div>
    </div>
  );
};
