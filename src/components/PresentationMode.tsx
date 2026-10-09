import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Trophy,
  Medal,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
  PartyPopper,
  Crown,
  Eye,
  CheckCircle2,
  Building2,
  UserCheck,
  Calendar,
  Play,
} from "lucide-react";
import {
  OperationRow,
  AngelRow,
  MetricDefinition,
  RankedItem,
  MonthHighlightData,
} from "../types";
import { METRICS } from "../utils/metrics";
import { calculateRanking, calculateMonthHighlight } from "../utils/ranking";
import { AvatarPhoto } from "./AvatarPhoto";
import { triggerConfetti, triggerGoldenFireworks } from "../utils/confetti";
import { AssetChip, Button } from "./stone-ds";

interface PresentationModeProps {
  operacoes: OperationRow[];
  angels: AngelRow[];
  fotosMap: Map<string, string>;
  referenceMonth: string;
  referenceYear?: string;
  onReferenceMonthChange?: (month: string) => void;
  onReferenceYearChange?: (year: string) => void;
  onExit: () => void;
}

type StepType =
  | "cover_1"
  | "cover_2"
  | "cover_3"
  | "category_demais"
  | "category_podium"
  | "highlight"
  | "finish";

interface PresentationStep {
  id: string;
  type: StepType;
  block: "OPERACOES" | "ANGELS";
  metric?: MetricDefinition;
  items?: RankedItem[];
  // For category_demais
  uniqueRanksDesc?: number[]; // e.g. [8, 7, 6, 5, 4]
  revealedRankCount?: number; // 0 = none, 1 = first revealed (highest number / last place), etc.
  // For category_podium
  revealedPodiumStep?: 0 | 1 | 2 | 3; // 0 = none, 1 = 3º, 2 = 2º, 3 = 1º
  // For highlight
  highlightData?: MonthHighlightData | null;
  // Metadata for navigation & UI
  title: string;
  subtitle: string;
  badgeLabel: string;
}

const MONTH_OPTIONS = [
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

export const PresentationMode: React.FC<PresentationModeProps> = ({
  operacoes,
  angels,
  fotosMap,
  referenceMonth,
  referenceYear = String(new Date().getFullYear()),
  onReferenceMonthChange,
  onReferenceYearChange,
  onExit,
}) => {
  // Estado local sincronizado de mês e ano para Capa 1
  const [localMonth, setLocalMonth] = useState<string>(() => {
    return localStorage.getItem("presentation_month") || referenceMonth || "Agosto";
  });
  const [localYear, setLocalYear] = useState<string>(() => {
    return localStorage.getItem("presentation_year") || referenceYear || String(new Date().getFullYear());
  });

  const handleUpdateMonth = (newMonth: string) => {
    setLocalMonth(newMonth);
    localStorage.setItem("presentation_month", newMonth);
    if (onReferenceMonthChange) {
      onReferenceMonthChange(newMonth);
    }
  };

  const handleUpdateYear = (newYear: string) => {
    setLocalYear(newYear);
    localStorage.setItem("presentation_year", newYear);
    if (onReferenceYearChange) {
      onReferenceYearChange(newYear);
    }
  };

  const formattedPeriod = `${localMonth} de ${localYear}`;

  // Pre-calculate metric definitions
  const operacoesMetrics = useMemo(() => METRICS, []);
  const angelsMetrics = useMemo(() => METRICS.filter((m) => !m.operationsOnly), []);

  // Calculate Month Highlights
  const operacoesHighlight = useMemo(() => {
    const allRankings = operacoesMetrics.map((metric) => ({
      metric,
      rankings: calculateRanking(operacoes, metric, fotosMap, true),
    }));
    return calculateMonthHighlight(allRankings, fotosMap, true);
  }, [operacoes, operacoesMetrics, fotosMap]);

  const angelsHighlight = useMemo(() => {
    const allRankings = angelsMetrics.map((metric) => ({
      metric,
      rankings: calculateRanking(angels, metric, fotosMap, false),
    }));
    return calculateMonthHighlight(allRankings, fotosMap, false);
  }, [angels, angelsMetrics, fotosMap]);

  // Build the complete linear sequence of presentation steps including the 3 Covers
  const steps: PresentationStep[] = useMemo(() => {
    const list: PresentationStep[] = [];

    // Helper to add a category sequence
    const addCategory = (
      block: "OPERACOES" | "ANGELS",
      metric: MetricDefinition,
      dataset: (OperationRow | AngelRow)[],
      isOp: boolean
    ) => {
      const items = calculateRanking(dataset, metric, fotosMap, isOp);
      const restItems = items.filter((it) => it.rank > 3);
      const blockLabel = block === "OPERACOES" ? "Operações" : "Green Angels";

      // Unique ranks > 3 in descending order (e.g. 8th, 7th, 6th, 5th, 4th)
      const uniqueRanksDesc: number[] = Array.from(
        new Set(restItems.map((i) => i.rank))
      ).sort((a, b) => b - a);

      // MOMENTO 1: Demais posições (se houver mais de 3 itens)
      if (uniqueRanksDesc.length > 0) {
        // Step 0: All hidden
        list.push({
          id: `${block}_${metric.key}_demais_0`,
          type: "category_demais",
          block,
          metric,
          items,
          uniqueRanksDesc,
          revealedRankCount: 0,
          title: metric.label,
          subtitle: `${blockLabel} • Demais Posições (4º em diante)`,
          badgeLabel: "Preparar Revelação",
        });

        // Steps 1..N: Reveal rank by rank from bottom to 4th
        for (let r = 1; r <= uniqueRanksDesc.length; r++) {
          const currentRankRevealed = uniqueRanksDesc[r - 1];
          list.push({
            id: `${block}_${metric.key}_demais_${r}`,
            type: "category_demais",
            block,
            metric,
            items,
            uniqueRanksDesc,
            revealedRankCount: r,
            title: metric.label,
            subtitle: `${blockLabel} • Revelando ${currentRankRevealed}º Lugar`,
            badgeLabel: `${r} de ${uniqueRanksDesc.length} revelados`,
          });
        }
      }

      // MOMENTO 2: Pódio dos Campeões
      // Step 0: Podium empty
      list.push({
        id: `${block}_${metric.key}_podium_0`,
        type: "category_podium",
        block,
        metric,
        items,
        revealedPodiumStep: 0,
        title: metric.label,
        subtitle: `${blockLabel} • Pódio dos Campeões`,
        badgeLabel: "Pódio a revelar",
      });

      // Step 1: Reveal 3º lugar (Bronze)
      list.push({
        id: `${block}_${metric.key}_podium_1`,
        type: "category_podium",
        block,
        metric,
        items,
        revealedPodiumStep: 1,
        title: metric.label,
        subtitle: `${blockLabel} • 3º Lugar (Bronze)`,
        badgeLabel: "Bronze Revelado",
      });

      // Step 2: Reveal 2º lugar (Prata)
      list.push({
        id: `${block}_${metric.key}_podium_2`,
        type: "category_podium",
        block,
        metric,
        items,
        revealedPodiumStep: 2,
        title: metric.label,
        subtitle: `${blockLabel} • 2º Lugar (Prata)`,
        badgeLabel: "Prata Revelada",
      });

      // Step 3: Reveal 1º lugar (Ouro Campeão)
      list.push({
        id: `${block}_${metric.key}_podium_3`,
        type: "category_podium",
        block,
        metric,
        items,
        revealedPodiumStep: 3,
        title: metric.label,
        subtitle: `${blockLabel} • 1º Lugar Campeão (Ouro)`,
        badgeLabel: "Ouro Campeão 🎉",
      });
    };

    // ==========================================
    // 1. CAPA 1: "RESULTADOS DO MÊS"
    // ==========================================
    list.push({
      id: "COVER_1",
      type: "cover_1",
      block: "OPERACOES",
      title: "RESULTADOS DO MÊS",
      subtitle: `Apresentação Oficial • ${formattedPeriod}`,
      badgeLabel: "Capa 1 • Resultados",
    });

    // ==========================================
    // 2. CAPA 2: "Operações SCL"
    // ==========================================
    list.push({
      id: "COVER_2",
      type: "cover_2",
      block: "OPERACOES",
      title: "Operações SCL",
      subtitle: `Resultados e Reconhecimentos • ${formattedPeriod}`,
      badgeLabel: "Capa 2 • Operações SCL",
    });

    // ==========================================
    // 3. CATEGORIAS DAS OPERAÇÕES (5 categorias)
    // ==========================================
    operacoesMetrics.forEach((metric) => {
      addCategory("OPERACOES", metric, operacoes, true);
    });

    // Destaque do Mês das Operações
    list.push({
      id: "OPERACOES_HIGHLIGHT",
      type: "highlight",
      block: "OPERACOES",
      highlightData: operacoesHighlight,
      title: "Destaque do Mês • Operações",
      subtitle: `Maior presença no pódio em ${formattedPeriod}`,
      badgeLabel: "MVP Operações",
    });

    // ==========================================
    // 4. CAPA 3: "Angels SCL"
    // ==========================================
    list.push({
      id: "COVER_3",
      type: "cover_3",
      block: "ANGELS",
      title: "Angels SCL",
      subtitle: `Resultados e Reconhecimentos • ${formattedPeriod}`,
      badgeLabel: "Capa 3 • Angels SCL",
    });

    // ==========================================
    // 5. CATEGORIAS DOS ANGELS (4 categorias)
    // ==========================================
    angelsMetrics.forEach((metric) => {
      addCategory("ANGELS", metric, angels, false);
    });

    // Destaque do Mês dos Angels
    list.push({
      id: "ANGELS_HIGHLIGHT",
      type: "highlight",
      block: "ANGELS",
      highlightData: angelsHighlight,
      title: "Destaque do Mês • Green Angels",
      subtitle: `Maior presença no pódio em ${formattedPeriod}`,
      badgeLabel: "MVP Green Angels",
    });

    // ==========================================
    // 6. ENCERRAMENTO
    // ==========================================
    list.push({
      id: "FINISH",
      type: "finish",
      block: "ANGELS",
      title: "Resultados Concluídos",
      subtitle: `Reconhecimentos de ${formattedPeriod}`,
      badgeLabel: "Fim da Apresentação",
    });

    return list;
  }, [
    operacoes,
    angels,
    fotosMap,
    operacoesMetrics,
    angelsMetrics,
    operacoesHighlight,
    angelsHighlight,
    formattedPeriod,
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStep = steps[currentIndex] || steps[0];

  // Advance to next step
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < steps.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [steps.length]);

  // Go to previous step
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  // Fire celebratory confetti on specific milestones
  useEffect(() => {
    if (currentStep.type === "category_podium" && currentStep.revealedPodiumStep === 3) {
      triggerGoldenFireworks();
    } else if (currentStep.type === "highlight") {
      triggerConfetti(0.5, 0.5);
    } else if (currentStep.type === "finish") {
      triggerGoldenFireworks();
    }
  }, [currentIndex, currentStep]);

  // Keyboard navigation: ArrowRight / Space = Next, ArrowLeft = Prev, Escape = Exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in year input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "SELECT") {
        if (e.key === "Escape") {
          onExit();
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onExit();
      } else if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, onExit]);

  // Enter browser Fullscreen if supported
  useEffect(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  // Progress calculations
  const progressPercent = Math.round(
    ((currentIndex + 1) / Math.max(1, steps.length)) * 100
  );

  // Maximum value for performance bar in Momento 1
  const maxCategoryValue = useMemo(() => {
    if (!currentStep.items || currentStep.items.length === 0) return 1;
    return Math.max(...currentStep.items.map((i) => i.value), 1);
  }, [currentStep.items]);

  // Set of revealed ranks in Momento 1
  const revealedRanksSet = useMemo(() => {
    if (
      currentStep.type !== "category_demais" ||
      !currentStep.uniqueRanksDesc ||
      !currentStep.revealedRankCount
    ) {
      return new Set<number>();
    }
    const count = currentStep.revealedRankCount;
    return new Set(currentStep.uniqueRanksDesc.slice(0, count));
  }, [currentStep]);

  return (
    <div
      onClick={(e) => {
        // Only advance if clicking directly on presentation backdrop (not controls/inputs)
        const target = e.target as HTMLElement;
        if (
          !target.closest("button") &&
          !target.closest("input") &&
          !target.closest("select")
        ) {
          handleNext();
        }
      }}
      className="fixed inset-0 z-50 flex flex-col bg-q-page select-none overflow-hidden cursor-default"
    >
      {/* Top Header Bar */}
      <header className="shrink-0 flex items-center justify-between px-6 py-3.5 bg-q-card border-b border-q-line shadow-sm">
        {/* Left: Branding & Category Details */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid size-10 place-items-center rounded-full bg-q-green text-white shrink-0">
            <Trophy className="size-5" strokeWidth={2.4} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-q-green-tint px-3 py-0.5 text-xs font-bold text-q-green-deep">
                {currentStep.block === "OPERACOES" ? "OPERAÇÕES SCL" : "GREEN ANGELS"}
              </span>
              <span className="text-xs font-semibold text-q-muted hidden sm:inline">•</span>
              <span className="text-xs font-semibold text-q-muted hidden sm:inline">
                {formattedPeriod}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-q-ink truncate m-0">
              {currentStep.title}
            </h1>
          </div>
        </div>

        {/* Center: Metric criteria chip (if on a category step) */}
        {currentStep.metric && (
          <div className="hidden md:flex items-center gap-2">
            <AssetChip
              variant="onGreen"
              label={currentStep.metric.shortLabel}
              className="bg-q-green text-white font-bold"
            />
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                currentStep.metric.direction === "higher_is_better"
                  ? "bg-[#e0efe8] text-[#0a6b40]"
                  : "bg-[#e3eefc] text-[#1f5aa6]"
              }`}
            >
              {currentStep.metric.direction === "higher_is_better"
                ? "▲ Maior é melhor"
                : "▼ Menor é melhor"}
            </span>
          </div>
        )}

        {/* Right: Exit Button and Progress Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] font-semibold text-q-muted">
              Etapa {currentIndex + 1} de {steps.length}
            </span>
            <span className="text-xs font-bold text-q-green">
              {currentStep.badgeLabel}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onExit();
            }}
            title="Sair do Modo Apresentação (Esc)"
            className="flex items-center gap-1.5 rounded-full bg-q-soft px-3.5 py-2 text-xs font-bold text-q-ink hover:bg-q-line transition-colors cursor-pointer"
          >
            <X className="size-4" />
            <span className="hidden sm:inline">Sair (Esc)</span>
          </button>
        </div>
      </header>

      {/* Thin Progress Bar */}
      <div className="h-1.5 w-full bg-q-line shrink-0">
        <div
          className="h-full bg-q-green transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Slide Stage Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center max-w-6xl w-full mx-auto">
        {/* ========================================================
            CAPA 1: "RESULTADOS DO MÊS"
            ======================================================== */}
        {currentStep.type === "cover_1" && (
          <div className="w-full text-center rounded-q-card bg-q-card p-8 sm:p-14 shadow-2xl border-2 border-q-green/20 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
            {/* Ambient Background Accents */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-q-green-tint/50"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-q-soft"
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Stone Trophy Icon */}
              <div className="size-20 sm:size-24 rounded-full bg-q-green text-white grid place-items-center shadow-xl shadow-q-green/30 mb-5">
                <Trophy className="size-10 sm:size-12" strokeWidth={2.3} />
              </div>

              {/* Tag / Brand Pill */}
              <div className="inline-flex items-center gap-2 rounded-full bg-q-green-tint px-4 py-1.5 text-xs font-black uppercase tracking-wider text-q-green-deep mb-3">
                <Sparkles className="size-3.5 text-q-green" />
                <span>Atendimento Técnico SCL • Stone</span>
              </div>

              {/* Big Title */}
              <h1 className="text-4xl sm:text-6xl font-black text-q-ink tracking-tight uppercase m-0 leading-none">
                RESULTADOS DO MÊS
              </h1>

              {/* Prominent Month & Year Highlight */}
              <div className="mt-3 mb-6 text-3xl sm:text-5xl font-black text-q-green tracking-tight">
                {localMonth} de {localYear}
              </div>

              {/* Period Selector Card */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-q-soft rounded-2xl p-4 sm:p-5 border border-q-line shadow-inner mb-6 text-left"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-q-muted uppercase tracking-wider mb-3">
                  <Calendar className="size-4 text-q-green" />
                  <span>Escolha o Mês e Ano de Referência:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Seletor de Mês */}
                  <div>
                    <label className="block text-[11px] font-bold text-q-ink mb-1">
                      Mês:
                    </label>
                    <select
                      value={localMonth}
                      onChange={(e) => handleUpdateMonth(e.target.value)}
                      className="w-full rounded-xl bg-q-card border border-q-line px-3 py-2 text-sm font-bold text-q-ink focus:outline-none focus:ring-2 focus:ring-q-green cursor-pointer shadow-sm"
                    >
                      {MONTH_OPTIONS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Campo de Ano */}
                  <div>
                    <label className="block text-[11px] font-bold text-q-ink mb-1">
                      Ano:
                    </label>
                    <input
                      type="number"
                      value={localYear}
                      onChange={(e) => handleUpdateYear(e.target.value)}
                      min={2020}
                      max={2035}
                      className="w-full rounded-xl bg-q-card border border-q-line px-3 py-2 text-sm font-bold text-q-ink focus:outline-none focus:ring-2 focus:ring-q-green shadow-sm"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-q-muted mt-2.5 mb-0 font-medium">
                  ✓ O período selecionado será salvo no navegador e aplicado em todos os títulos e destaques.
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-q-green px-8 py-4 text-base font-black text-white hover:bg-q-green-deep shadow-xl shadow-q-green/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Começar Apresentação</span>
                <Play className="size-4 fill-current" />
              </button>

              <span className="text-xs text-q-muted mt-3">
                Ou clique em qualquer lugar da tela / pressione <kbd className="font-mono bg-q-soft px-1.5 py-0.5 rounded border border-q-line text-q-ink">Espaço</kbd>
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            CAPA 2: "Operações SCL"
            ======================================================== */}
        {currentStep.type === "cover_2" && (
          <div className="w-full text-center rounded-q-card bg-q-card p-8 sm:p-14 shadow-2xl border-2 border-q-green/20 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
            {/* Ambient Background Accents */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-q-green-tint/50"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-q-soft"
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Operations Icon */}
              <div className="size-20 sm:size-24 rounded-full bg-q-green-tint text-q-green-deep grid place-items-center shadow-lg border-2 border-q-green/30 mb-5">
                <Building2 className="size-10 sm:size-12" strokeWidth={2.2} />
              </div>

              {/* Tag Pill */}
              <div className="inline-flex items-center gap-2 rounded-full bg-q-green-tint px-4 py-1.5 text-xs font-black uppercase tracking-wider text-q-green-deep mb-3">
                <span>Bloco 1 • Franquias & Polos</span>
              </div>

              {/* Big Title */}
              <h1 className="text-4xl sm:text-6xl font-black text-q-ink tracking-tight m-0 leading-none">
                Operações SCL
              </h1>

              {/* Period in smaller highlight */}
              <div className="mt-3 mb-6 text-xl sm:text-2xl font-bold text-q-muted">
                Resultados e Reconhecimentos •{" "}
                <span className="text-q-green font-extrabold">{formattedPeriod}</span>
              </div>

              {/* Info Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8 max-w-lg">
                <span className="rounded-full bg-q-soft border border-q-line px-4 py-2 text-xs font-bold text-q-ink">
                  🏢 {operacoes.length} Operações avaliadas
                </span>
                <span className="rounded-full bg-q-soft border border-q-line px-4 py-2 text-xs font-bold text-q-ink">
                  📊 5 Categorias em disputa
                </span>
                <span className="rounded-full bg-q-soft border border-q-line px-4 py-2 text-xs font-bold text-q-ink">
                  ⭐ Pódios & Destaque do Mês
                </span>
              </div>

              {/* CTA Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-q-green px-8 py-3.5 text-sm font-bold text-white hover:bg-q-green-deep shadow-lg shadow-q-green/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Iniciar Operações</span>
                <ChevronRight className="size-4" />
              </button>

              <span className="text-xs text-q-muted mt-3">
                Pressione <kbd className="font-mono bg-q-soft px-1.5 py-0.5 rounded border border-q-line text-q-ink">Espaço</kbd> ou clique para avançar
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            CAPA 3: "Angels SCL"
            ======================================================== */}
        {currentStep.type === "cover_3" && (
          <div className="w-full text-center rounded-q-card bg-q-card p-8 sm:p-14 shadow-2xl border-2 border-q-green/20 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
            {/* Ambient Background Accents */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-q-green-tint/50"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-q-soft"
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Angels Icon */}
              <div className="size-20 sm:size-24 rounded-full bg-q-green-tint text-q-green-deep grid place-items-center shadow-lg border-2 border-q-green/30 mb-5">
                <UserCheck className="size-10 sm:size-12" strokeWidth={2.2} />
              </div>

              {/* Tag Pill */}
              <div className="inline-flex items-center gap-2 rounded-full bg-q-green-tint px-4 py-1.5 text-xs font-black uppercase tracking-wider text-q-green-deep mb-3">
                <span>Bloco 2 • Performance Individual</span>
              </div>

              {/* Big Title */}
              <h1 className="text-4xl sm:text-6xl font-black text-q-ink tracking-tight m-0 leading-none">
                Angels SCL
              </h1>

              {/* Period in smaller highlight */}
              <div className="mt-3 mb-6 text-xl sm:text-2xl font-bold text-q-muted">
                Resultados e Reconhecimentos •{" "}
                <span className="text-q-green font-extrabold">{formattedPeriod}</span>
              </div>

              {/* Info Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8 max-w-lg">
                <span className="rounded-full bg-q-soft border border-q-line px-4 py-2 text-xs font-bold text-q-ink">
                  💚 {angels.length} Green Angels avaliados
                </span>
                <span className="rounded-full bg-q-soft border border-q-line px-4 py-2 text-xs font-bold text-q-ink">
                  🎯 4 Categorias técnicas
                </span>
                <span className="rounded-full bg-q-soft border border-q-line px-4 py-2 text-xs font-bold text-q-ink">
                  👑 Reconhecimento individual
                </span>
              </div>

              {/* CTA Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-q-green px-8 py-3.5 text-sm font-bold text-white hover:bg-q-green-deep shadow-lg shadow-q-green/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Iniciar Green Angels</span>
                <ChevronRight className="size-4" />
              </button>

              <span className="text-xs text-q-muted mt-3">
                Pressione <kbd className="font-mono bg-q-soft px-1.5 py-0.5 rounded border border-q-line text-q-ink">Espaço</kbd> ou clique para avançar
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            MOMENTO 1: DEMAIS POSIÇÕES (4º em diante)
            ======================================================== */}
        {currentStep.type === "category_demais" && currentStep.items && (
          <div className="w-full rounded-q-card bg-q-card p-6 sm:p-8 shadow-md border border-q-line animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-q-line pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-q-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-q-muted mb-1">
                  <Eye className="size-3.5 text-q-green" />
                  Momento 1 • Revelação das Demais Posições
                </span>
                <h2 className="text-2xl font-black text-q-ink m-0 tracking-tight">
                  {currentStep.title}
                </h2>
                <p className="text-xs text-q-muted m-0 mt-0.5">
                  Começando pela última colocação até o 4º lugar
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-q-green-tint px-3.5 py-1.5 text-xs font-extrabold text-q-green-deep">
                  {currentStep.revealedRankCount || 0} de{" "}
                  {currentStep.uniqueRanksDesc?.length || 0} reveladas
                </span>
              </div>
            </div>

            {/* Table Header */}
            <div className="mb-2 hidden sm:flex items-center gap-3 px-3 text-xs font-bold text-q-muted uppercase tracking-wider">
              <span className="w-10 text-center">Pos.</span>
              <span className="flex-1">Participante</span>
              <span className="w-36 text-center">Desempenho</span>
              <span className="w-24 text-right">
                {currentStep.metric?.shortLabel}
              </span>
            </div>

            {/* List of 4th+ items */}
            <div className="space-y-2">
              {currentStep.items
                .filter((it) => it.rank > 3)
                .map((item) => {
                  const isRevealed = revealedRanksSet.has(item.rank);
                  const percentage = Math.min(
                    100,
                    Math.max(8, (item.value / maxCategoryValue) * 100)
                  );

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                        isRevealed
                          ? "bg-q-row border-2 border-q-green/30 shadow-sm"
                          : "bg-q-soft/60 border border-dashed border-q-line opacity-75"
                      }`}
                    >
                      {/* Rank Badge */}
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
                          isRevealed
                            ? "bg-q-green-tint text-q-green-deep ring-2 ring-q-green/40"
                            : "bg-q-soft text-q-muted"
                        }`}
                      >
                        {item.rank}º
                      </span>

                      {/* Participant Avatar & Name */}
                      <div className="flex min-w-0 flex-1 items-center gap-3.5">
                        {isRevealed ? (
                          <AvatarPhoto
                            src={item.photoUrl}
                            name={item.nome}
                            fallbackInitials={item.avatarFallback}
                            size="md"
                          />
                        ) : (
                          <div className="size-10 rounded-full bg-q-line/80 grid place-items-center text-xs font-bold text-q-muted shrink-0">
                            ?
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            {isRevealed ? (
                              <span className="block truncate text-base font-extrabold text-q-ink">
                                {item.displayNome}
                              </span>
                            ) : (
                              <span className="block text-base font-black text-q-muted tracking-widest">
                                ???
                              </span>
                            )}

                            {isRevealed && item.isTied && (
                              <span className="rounded-full bg-q-soft px-2 py-0.5 text-[10px] font-bold uppercase text-q-muted">
                                Empate
                              </span>
                            )}
                          </div>

                          {isRevealed && currentStep.block === "OPERACOES" && (
                            <span className="block truncate text-xs text-q-muted">
                              {item.nome}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Performance Bar */}
                      <div className="hidden sm:block w-36">
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-q-line">
                          {isRevealed ? (
                            <div
                              className="h-full rounded-full bg-q-green transition-all duration-700 ease-out"
                              style={{ width: `${percentage}%` }}
                            />
                          ) : (
                            <div className="h-full w-0" />
                          )}
                        </div>
                      </div>

                      {/* Metric Value */}
                      <span
                        className={`w-24 shrink-0 text-right text-base font-black ${
                          isRevealed ? "text-q-ink" : "text-q-muted"
                        }`}
                      >
                        {isRevealed ? item.formattedValue : "—"}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================
            MOMENTO 2: PÓDIO DOS CAMPEÕES (3º, 2º e 1º Lugar)
            ======================================================== */}
        {currentStep.type === "category_podium" && currentStep.items && (
          <div className="w-full rounded-q-card bg-q-card p-6 sm:p-8 shadow-md border border-q-line animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-q-line pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-q-green-tint px-3 py-1 text-xs font-bold uppercase tracking-wider text-q-green-deep mb-1">
                  <Trophy className="size-3.5 text-q-green" />
                  Momento 2 • Pódio dos Campeões
                </span>
                <h2 className="text-2xl font-black text-q-ink m-0 tracking-tight">
                  {currentStep.title}
                </h2>
                <p className="text-xs text-q-muted m-0 mt-0.5">
                  Revelando os 3 melhores colocados
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-q-soft px-3.5 py-1.5 text-xs font-extrabold text-q-ink">
                  {currentStep.revealedPodiumStep === 0 && "Aguardando revelação"}
                  {currentStep.revealedPodiumStep === 1 && "3º Lugar Revelado"}
                  {currentStep.revealedPodiumStep === 2 && "2º Lugar Revelado"}
                  {currentStep.revealedPodiumStep === 3 && "🏆 1º Lugar Campeão!"}
                </span>
              </div>
            </div>

            {/* 3 Pedestais (2º Prata à esquerda, 1º Ouro ao centro, 3º Bronze à direita) */}
            {(() => {
              const first = currentStep.items[0];
              const second = currentStep.items[1];
              const third = currentStep.items[2];

              const is3Revealed = (currentStep.revealedPodiumStep || 0) >= 1;
              const is2Revealed = (currentStep.revealedPodiumStep || 0) >= 2;
              const is1Revealed = (currentStep.revealedPodiumStep || 0) >= 3;

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-5 pt-4">
                  {/* 2º LUGAR (PRATA) - Esquerda */}
                  <div className="order-2 md:order-1 flex flex-col justify-end">
                    <div
                      className={`relative rounded-3xl p-5 text-center transition-all duration-500 ${
                        is2Revealed
                          ? "bg-q-podium-2 shadow-lg border-2 border-[#a9a9b1] scale-100"
                          : "bg-q-soft/40 border border-dashed border-q-line scale-95 opacity-60"
                      }`}
                    >
                      <span className="absolute right-4 top-4 text-q-muted/50">
                        <Medal className="size-6" />
                      </span>

                      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide bg-white text-[#55555b] shadow-sm">
                        🥈 2º Lugar (Prata)
                      </span>

                      <div className="mb-3 flex justify-center">
                        {is2Revealed && second ? (
                          <div className="relative">
                            <AvatarPhoto
                              src={second.photoUrl}
                              name={second.nome}
                              fallbackInitials={second.avatarFallback}
                              size="xl"
                              medalRing="silver"
                            />
                            <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border-2 border-white text-xs font-extrabold bg-[#a9a9b1] text-white">
                              2
                            </span>
                          </div>
                        ) : (
                          <div className="size-20 rounded-full bg-q-line grid place-items-center text-2xl font-black text-q-muted">
                            ?
                          </div>
                        )}
                      </div>

                      <h3 className="m-0 text-lg font-extrabold text-q-ink truncate">
                        {is2Revealed && second ? second.displayNome : "???"}
                      </h3>
                      {is2Revealed &&
                        second &&
                        currentStep.block === "OPERACOES" && (
                          <span className="text-xs text-q-muted block truncate mt-0.5">
                            {second.nome}
                          </span>
                        )}

                      <div className="mt-3 rounded-2xl bg-white px-3 py-2.5 shadow-sm">
                        <span className="block text-[10px] font-bold uppercase text-q-muted">
                          {currentStep.metric?.shortLabel}
                        </span>
                        <span className="text-xl font-black text-q-ink">
                          {is2Revealed && second ? second.formattedValue : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Pedestal Prata */}
                    <div className="mt-2 hidden md:flex flex-col items-center justify-center h-20 rounded-2xl q-stripes text-q-green-deep">
                      <span className="text-3xl font-black leading-none">2</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-q-green-deep/80">
                        Prata
                      </span>
                    </div>
                  </div>

                  {/* 1º LUGAR (OURO) - Centro, Maior */}
                  <div className="order-1 md:order-2 flex flex-col justify-end">
                    <div
                      className={`relative rounded-3xl p-6 text-center transition-all duration-500 ${
                        is1Revealed
                          ? "bg-q-podium-1 shadow-2xl border-4 border-[#d9a512] scale-105 ring-4 ring-[#d9a512]/20"
                          : "bg-q-soft/40 border border-dashed border-q-line scale-95 opacity-60"
                      }`}
                    >
                      <span className="absolute right-4 top-4 text-[#d9a512]">
                        <Trophy className="size-8" />
                      </span>

                      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-black uppercase tracking-wide bg-[#fbf3d4] text-[#7a5c00] shadow-sm">
                        <Sparkles className="size-3.5 text-[#d9a512]" />
                        🥇 1º Lugar Campeão
                      </span>

                      <div className="mb-3 flex justify-center">
                        {is1Revealed && first ? (
                          <div className="relative">
                            <AvatarPhoto
                              src={first.photoUrl}
                              name={first.nome}
                              fallbackInitials={first.avatarFallback}
                              size="2xl"
                              medalRing="gold"
                            />
                            <span className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border-2 border-white text-sm font-black bg-[#d9a512] text-white">
                              1
                            </span>
                          </div>
                        ) : (
                          <div className="size-28 rounded-full bg-q-line grid place-items-center text-4xl font-black text-q-muted">
                            ?
                          </div>
                        )}
                      </div>

                      <h3 className="m-0 text-xl font-black text-q-ink truncate">
                        {is1Revealed && first ? first.displayNome : "???"}
                      </h3>
                      {is1Revealed &&
                        first &&
                        currentStep.block === "OPERACOES" && (
                          <span className="text-xs text-q-muted block truncate mt-0.5">
                            {first.nome}
                          </span>
                        )}

                      <div className="mt-4 rounded-2xl bg-white px-4 py-3 shadow-md">
                        <span className="block text-[11px] font-bold uppercase text-q-muted">
                          {currentStep.metric?.label}
                        </span>
                        <span className="text-3xl font-black text-q-green">
                          {is1Revealed && first ? first.formattedValue : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Pedestal Ouro */}
                    <div className="mt-2 hidden md:flex flex-col items-center justify-center h-28 rounded-2xl bg-q-green text-white shadow-md">
                      <span className="text-4xl font-black leading-none">1</span>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-white/90">
                        Campeão
                      </span>
                    </div>
                  </div>

                  {/* 3º LUGAR (BRONZE) - Direita */}
                  <div className="order-3 flex flex-col justify-end">
                    <div
                      className={`relative rounded-3xl p-5 text-center transition-all duration-500 ${
                        is3Revealed
                          ? "bg-q-podium-3 shadow-lg border-2 border-[#c7794b] scale-100"
                          : "bg-q-soft/40 border border-dashed border-q-line scale-95 opacity-60"
                      }`}
                    >
                      <span className="absolute right-4 top-4 text-q-muted/50">
                        <Award className="size-6" />
                      </span>

                      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide bg-white text-[#9a5330] shadow-sm">
                        🥉 3º Lugar (Bronze)
                      </span>

                      <div className="mb-3 flex justify-center">
                        {is3Revealed && third ? (
                          <div className="relative">
                            <AvatarPhoto
                              src={third.photoUrl}
                              name={third.nome}
                              fallbackInitials={third.avatarFallback}
                              size="xl"
                              medalRing="bronze"
                            />
                            <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border-2 border-white text-xs font-extrabold bg-[#c7794b] text-white">
                              3
                            </span>
                          </div>
                        ) : (
                          <div className="size-20 rounded-full bg-q-line grid place-items-center text-2xl font-black text-q-muted">
                            ?
                          </div>
                        )}
                      </div>

                      <h3 className="m-0 text-lg font-extrabold text-q-ink truncate">
                        {is3Revealed && third ? third.displayNome : "???"}
                      </h3>
                      {is3Revealed &&
                        third &&
                        currentStep.block === "OPERACOES" && (
                          <span className="text-xs text-q-muted block truncate mt-0.5">
                            {third.nome}
                          </span>
                        )}

                      <div className="mt-3 rounded-2xl bg-white px-3 py-2.5 shadow-sm">
                        <span className="block text-[10px] font-bold uppercase text-q-muted">
                          {currentStep.metric?.shortLabel}
                        </span>
                        <span className="text-xl font-black text-q-ink">
                          {is3Revealed && third ? third.formattedValue : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Pedestal Bronze */}
                    <div className="mt-2 hidden md:flex flex-col items-center justify-center h-16 rounded-2xl q-stripes text-q-green-deep">
                      <span className="text-2xl font-black leading-none">3</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-q-green-deep/80">
                        Bronze
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================
            DESTAQUE DO MÊS
            ======================================================== */}
        {currentStep.type === "highlight" && currentStep.highlightData && (
          <div className="w-full relative overflow-hidden rounded-q-card bg-q-green p-8 sm:p-10 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            {/* Ambient Background Accents */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full bg-white/10"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 right-32 size-72 rounded-full bg-white/5"
            />

            <div className="relative flex flex-col gap-6">
              {/* Header */}
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                  <Crown className="size-4 text-[#FFEB41]" />
                  {currentStep.block === "OPERACOES"
                    ? "Destaque do Mês • Operações SCL"
                    : "Destaque do Mês • Green Angels"}
                </span>

                <span className="text-xs font-bold text-white/80 bg-white/10 px-3 py-1 rounded-full">
                  Mês de {formattedPeriod}
                </span>
              </div>

              {/* Identity Details */}
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left pt-2">
                <AvatarPhoto
                  src={currentStep.highlightData.photoUrl}
                  name={currentStep.highlightData.nome}
                  fallbackInitials={currentStep.highlightData.avatarFallback}
                  size="2xl"
                  medalRing="gold"
                />

                <div className="min-w-0">
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white m-0">
                    {currentStep.highlightData.displayNome}
                  </h2>
                  {currentStep.block === "OPERACOES" && (
                    <p className="text-xs font-medium text-white/75 m-0 mt-0.5">
                      {currentStep.highlightData.nome}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-white/90 m-0 mt-2 max-w-lg">
                    {currentStep.highlightData.summaryNote}
                  </p>
                </div>
              </div>

              {/* Score / Counter Cards */}
              <div className="flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-white/20">
                <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
                  <div>
                    <span className="block text-5xl font-black leading-none">
                      {currentStep.highlightData.totalPodiums}
                    </span>
                    <span className="block text-xs font-bold text-white/75 mt-1 uppercase tracking-wider">
                      Pódios Conquistados
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pb-0.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 py-1.5 pl-2 pr-3.5 text-xs font-extrabold">
                      <span className="grid size-5 place-items-center rounded-full text-[11px] font-black bg-[#E9B824] text-[#111]">
                        1º
                      </span>
                      {currentStep.highlightData.firstPlaceCount}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 py-1.5 pl-2 pr-3.5 text-xs font-extrabold">
                      <span className="grid size-5 place-items-center rounded-full text-[11px] font-black bg-[#D8D8DD] text-[#111]">
                        2º
                      </span>
                      {currentStep.highlightData.secondPlaceCount}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 py-1.5 pl-2 pr-3.5 text-xs font-extrabold">
                      <span className="grid size-5 place-items-center rounded-full text-[11px] font-black bg-[#D98A5B] text-[#111]">
                        3º
                      </span>
                      {currentStep.highlightData.thirdPlaceCount}
                    </span>
                  </div>
                </div>

                <Button
                  variant="onGreen"
                  size="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerGoldenFireworks();
                  }}
                  className="font-bold text-xs uppercase tracking-wider gap-2 shadow-lg"
                >
                  <PartyPopper className="size-4" />
                  Celebrar Reconhecimento
                </Button>
              </div>

              {/* Achievements Chips */}
              {currentStep.highlightData.appearances.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {currentStep.highlightData.appearances.map((app, idx) => {
                    const medal =
                      app.rank === 1 ? "🥇" : app.rank === 2 ? "🥈" : "🥉";
                    return (
                      <AssetChip
                        key={idx}
                        variant="onGreen"
                        icon={<span>{medal}</span>}
                        label={`${app.rank}º em ${app.categoryLabel}:`}
                        value={app.valueFormatted}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TELA FINAL DE ENCERRAMENTO
            ======================================================== */}
        {currentStep.type === "finish" && (
          <div className="w-full text-center rounded-q-card bg-q-card p-10 sm:p-14 shadow-2xl border border-q-line animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-q-green-tint text-q-green mb-6 shadow-inner">
              <CheckCircle2 className="size-10" strokeWidth={2.5} />
            </div>

            <span className="rounded-full bg-q-green-tint px-4 py-1.5 text-xs font-black uppercase tracking-wider text-q-green-deep">
              Apresentação Concluída
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-q-ink tracking-tight mt-3 mb-2">
              Resultados e Reconhecimentos de {formattedPeriod}
            </h2>

            <p className="text-sm sm:text-base text-q-muted max-w-lg mx-auto mb-8 font-medium">
              Parabéns a todas as Operações e Green Angels pelo empenho,
              dedicação e alto desempenho ao longo do mês!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerGoldenFireworks();
                }}
                className="gap-2 font-bold"
              >
                <PartyPopper className="size-4" />
                Celebrar Resultados 🎉
              </Button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(0);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-q-line bg-q-card px-5 py-2.5 text-xs font-bold text-q-ink hover:bg-q-soft transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                Reiniciar Apresentação
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExit();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-q-ink text-white px-5 py-2.5 text-xs font-bold hover:bg-black/80 transition-colors cursor-pointer"
              >
                Voltar ao Painel
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Floating Navigation Controls */}
      <footer className="shrink-0 bg-q-card border-t border-q-line px-6 py-3 shadow-lg flex items-center justify-between gap-4">
        {/* Left: Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 rounded-full bg-q-soft px-4 py-2 text-xs font-bold text-q-ink hover:bg-q-line disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft className="size-4" />
          <span>Voltar (Seta Esquerda)</span>
        </button>

        {/* Center: Slide indicator & shortcuts tip */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-q-muted hidden md:inline">
            Clique na tela ou use <kbd className="px-1.5 py-0.5 rounded bg-q-soft border border-q-line text-q-ink font-mono text-[10px]">Espaço</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-q-soft border border-q-line text-q-ink font-mono text-[10px]">Seta Direita</kbd>
          </span>

          <span className="text-xs font-extrabold text-q-ink bg-q-soft px-3 py-1 rounded-full">
            {currentIndex + 1} / {steps.length}
          </span>
        </div>

        {/* Right: Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          disabled={currentIndex >= steps.length - 1}
          className="inline-flex items-center gap-1.5 rounded-full bg-q-green px-5 py-2 text-xs font-extrabold text-white hover:bg-q-green-deep disabled:opacity-40 disabled:pointer-events-none shadow-md transition-colors cursor-pointer"
        >
          <span>Avançar</span>
          <ChevronRight className="size-4" />
        </button>
      </footer>
    </div>
  );
};
