import React, { useState } from "react";
import {
  Maximize2,
  Minimize2,
  RefreshCw,
  Settings,
  Calendar,
  Building2,
  UserCheck,
  Check,
  Award,
} from "lucide-react";
import { ViewMode, MetricDefinition, MetricKey } from "../types";
import { Display, Text, Button, AssetChip } from "./stone-ds";

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  referenceMonth: string;
  onReferenceMonthChange: (month: string) => void;
  metrics: MetricDefinition[];
  activeMetricKey: MetricKey;
  onMetricSelect: (key: MetricKey) => void;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenSettings: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const MONTH_PRESETS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  referenceMonth,
  onReferenceMonthChange,
  metrics,
  activeMetricKey,
  onMetricSelect,
  onRefresh,
  isLoading,
  onOpenSettings,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [isEditingMonth, setIsEditingMonth] = useState(false);
  const [tempMonth, setTempMonth] = useState(referenceMonth);

  const handleSaveMonth = () => {
    if (tempMonth.trim()) {
      onReferenceMonthChange(tempMonth.trim());
    }
    setIsEditingMonth(false);
  };

  return (
    <header className="relative z-20 border-b border-[#00461E] bg-[#1E281E]/95 backdrop-blur-md sticky top-0 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        {/* Top bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Logo, Title and Month Field */}
          <div className="flex items-center justify-between lg:justify-start gap-4">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-stone-md bg-[#00D700] text-[#00461E] shadow-lg shadow-[#00D700]/20">
                <Award className="w-6 h-6 stroke-[2.5]" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#A5FA00] rounded-stone-pill border-2 border-[#1E281E]" />
              </div>
              <div>
                <Display
                  as="h1"
                  width="condensed"
                  uppercase={true}
                  className="text-xl sm:text-2xl text-[#F5FFF5] tracking-tight"
                >
                  Resultados & Reconhecimentos
                </Display>
                <div className="flex items-center gap-2 text-xs mt-0.5">
                  <Text weight="medium" size="caption" className="text-[#A5FA00]">
                    Operação de Atendimento Técnico Stone
                  </Text>
                  <span className="text-[#505A50]">•</span>
                  
                  {/* Campo Editável de Mês */}
                  {isEditingMonth ? (
                    <div className="inline-flex items-center gap-1 bg-[#00461E] border border-[#00D700] rounded-stone-pill px-2.5 py-0.5">
                      <input
                        type="text"
                        value={tempMonth}
                        onChange={(e) => setTempMonth(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveMonth()}
                        autoFocus
                        list="months-list"
                        className="bg-transparent text-[#A5FA00] text-xs font-bold focus:outline-none w-24 font-body"
                      />
                      <datalist id="months-list">
                        {MONTH_PRESETS.map((m) => (
                          <option key={m} value={m} />
                        ))}
                      </datalist>
                      <button
                        onClick={handleSaveMonth}
                        className="text-[#00D700] hover:text-[#A5FA00] p-0.5 cursor-pointer"
                        title="Salvar mês"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setTempMonth(referenceMonth);
                        setIsEditingMonth(true);
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-[#00461E] bg-[#D2FF7D] hover:bg-[#A5FA00] px-2.5 py-0.5 rounded-stone-pill transition-colors cursor-pointer text-xs"
                      title="Clique para editar o mês de referência"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{referenceMonth}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Central Mode Switcher: OPERAÇÕES | ANGELS (Stone Pill Layout) */}
          <div className="flex items-center justify-center">
            <div className="inline-flex p-1.5 rounded-stone-pill bg-[#00461E]/80 border border-[#007D00] shadow-inner">
              <button
                onClick={() => onViewModeChange("OPERACOES")}
                className={`flex items-center gap-2 px-5 py-2 rounded-stone-pill text-xs sm:text-sm font-body font-bold transition-all cursor-pointer ${
                  viewMode === "OPERACOES"
                    ? "bg-[#00D700] text-[#00461E] shadow-md shadow-[#00D700]/30"
                    : "text-[#C8D2C8] hover:text-[#F5FFF5]"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>OPERAÇÕES</span>
              </button>

              <button
                onClick={() => onViewModeChange("ANGELS")}
                className={`flex items-center gap-2 px-5 py-2 rounded-stone-pill text-xs sm:text-sm font-body font-bold transition-all cursor-pointer ${
                  viewMode === "ANGELS"
                    ? "bg-[#00D700] text-[#00461E] shadow-md shadow-[#00D700]/30"
                    : "text-[#C8D2C8] hover:text-[#F5FFF5]"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>GREEN ANGELS</span>
              </button>
            </div>
          </div>

          {/* Right Action buttons: Refresh, Fullscreen, Settings */}
          <div className="flex items-center justify-end gap-2">
            {/* Atualizar dados button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-2 text-xs"
              title="Recarregar dados da planilha Google Sheets"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#00D700]" : ""}`} />
              <span className="hidden sm:inline">Atualizar dados</span>
            </Button>

            {/* Tela cheia (Apresentação / Reunião) button */}
            <Button
              variant={isFullscreen ? "primary" : "outline"}
              size="sm"
              onClick={onToggleFullscreen}
              className="gap-2 text-xs"
              title={isFullscreen ? "Sair do modo tela cheia" : "Modo tela cheia para reunião"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Sair Tela Cheia</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Modo Reunião</span>
                </>
              )}
            </Button>

            {/* Planilha Settings modal */}
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-stone-pill bg-[#00461E] border border-[#007D00] hover:border-[#00D700] text-[#C8D2C8] hover:text-[#00D700] transition-all cursor-pointer"
              title="Configurações da Planilha"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs (Uma aba por categoria, no estilo Stone Assets) */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 scrollbar-none no-scrollbar">
          {metrics.map((metric) => {
            const isActive = metric.key === activeMetricKey;
            return (
              <button
                key={metric.key}
                onClick={() => onMetricSelect(metric.key)}
                className={`whitespace-nowrap px-4 py-2 rounded-stone-pill text-xs font-body font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 border-2 ${
                  isActive
                    ? "bg-[#00D700] text-[#00461E] border-[#A5FA00] shadow-md shadow-[#00D700]/25 font-bold"
                    : "bg-[#00461E]/60 border-[#007D00]/60 text-[#C8D2C8] hover:text-[#F5FFF5] hover:bg-[#00461E]"
                }`}
              >
                <span>{metric.shortLabel}</span>
                {metric.direction === "higher_is_better" ? (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-stone-pill font-bold ${
                      isActive
                        ? "bg-[#00461E] text-[#A5FA00]"
                        : "bg-[#007D00] text-[#87FF4B]"
                    }`}
                  >
                    ▲ Maior
                  </span>
                ) : (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-stone-pill font-bold ${
                      isActive
                        ? "bg-[#00461E] text-[#D2FF7D]"
                        : "bg-[#005A46] text-[#0FE1B9]"
                    }`}
                  >
                    ▼ Menor
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
