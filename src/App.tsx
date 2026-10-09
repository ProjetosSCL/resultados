/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "./components/Header";
import { PageHead } from "./components/PageHead";
import { Rail } from "./components/Rail";
import { Podium } from "./components/Podium";
import { RankingChart } from "./components/RankingChart";
import { RankingList } from "./components/RankingList";
import { MonthHighlight } from "./components/MonthHighlight";
import { StatCard } from "./components/StatCard";
import { PresentationMode } from "./components/PresentationMode";
import {
  ViewMode,
  MetricKey,
  OperationRow,
  AngelRow,
} from "./types";
import { getMetricsForView } from "./utils/metrics";
import { calculateRanking, calculateMonthHighlight } from "./utils/ranking";
import {
  SUPABASE_URL,
  SUPABASE_KEY,
  loadSupabaseData,
  formatUpdateDateTime,
} from "./services/supabaseService";
import { UNIDADE } from "./config";
import {
  AlertCircle,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Tv,
  RefreshCw,
} from "lucide-react";

export default function App() {
  // Estado de Visualização
  const [viewMode, setViewMode] = useState<ViewMode>("OPERACOES");
  const [activeMetricKey, setActiveMetricKey] = useState<MetricKey>("CHAMADOS");

  // Dados do Supabase
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [displayMonth, setDisplayMonth] = useState<string>("");
  const [operacoes, setOperacoes] = useState<OperationRow[]>([]);
  const [angels, setAngels] = useState<AngelRow[]>([]);
  const [fotosMap, setFotosMap] = useState<Map<string, string>>(new Map());

  // Estados de controle de carregamento, erro e atualização
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshToast, setRefreshToast] = useState<string | null>(null);

  // Modo Apresentação e Tela Cheia
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Função para carregar os dados do Supabase
  const fetchData = useCallback(async (targetMonth?: string) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const result = await loadSupabaseData(targetMonth);
      setAvailableMonths(result.availableMonths);
      setSelectedMonth(result.rawMonth);
      setDisplayMonth(result.displayMonth);
      setOperacoes(result.operacoes);
      setAngels(result.angels);
      setFotosMap(result.fotosMap);
      setLastUpdated(result.updatedAt);

      setRefreshToast("Dados sincronizados com o Supabase!");
      setTimeout(() => setRefreshToast(null), 3000);
    } catch (err: any) {
      // Se a leitura falhar, mostra mensagem bem visível sem dados antigos
      setOperacoes([]);
      setAngels([]);
      setFetchError(err.message || "Erro inesperado ao consultar o banco Supabase.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carrega ao montar a página
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Lista de métricas disponíveis para o modo atual
  const activeMetrics = useMemo(() => {
    return getMetricsForView(viewMode === "OPERACOES");
  }, [viewMode]);

  // Se a métrica ativa não existir no modo atual, reseta para CHAMADOS
  useEffect(() => {
    const exists = activeMetrics.some((m) => m.key === activeMetricKey);
    if (!exists && activeMetrics.length > 0) {
      setActiveMetricKey(activeMetrics[0].key);
    }
  }, [viewMode, activeMetrics, activeMetricKey]);

  // Monitora alterações de tela cheia nativa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Alterna tela cheia
  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen toggle error:", err);
    }
  };

  // Troca de mês via seletor
  const handleSelectMonth = (newMonth: string) => {
    if (newMonth && newMonth !== selectedMonth) {
      fetchData(newMonth);
    }
  };

  // Métrica ativa atual
  const currentMetric = useMemo(() => {
    return activeMetrics.find((m) => m.key === activeMetricKey) || activeMetrics[0];
  }, [activeMetrics, activeMetricKey]);

  const isOperations = viewMode === "OPERACOES";
  const currentDataset = isOperations ? operacoes : angels;

  // Calcula o ranking da categoria ativa
  const rankedItems = useMemo(() => {
    if (!currentMetric || currentDataset.length === 0) return [];
    return calculateRanking(currentDataset, currentMetric, fotosMap, isOperations);
  }, [currentDataset, currentMetric, fotosMap, isOperations]);

  // Calcula todos os rankings de todas as categorias para apurar o "Destaque do Mês"
  const allCategoryRankings = useMemo(() => {
    if (currentDataset.length === 0) return [];
    return activeMetrics.map((metric) => ({
      metric,
      rankings: calculateRanking(currentDataset, metric, fotosMap, isOperations),
    }));
  }, [activeMetrics, currentDataset, fotosMap, isOperations]);

  // Destaque do mês (quem mais subiu ao pódio)
  const monthHighlight = useMemo(() => {
    if (allCategoryRankings.length === 0) return null;
    return calculateMonthHighlight(allCategoryRankings, fotosMap, isOperations);
  }, [allCategoryRankings, fotosMap, isOperations]);

  // Estatísticas rápidas de resumo
  const categoryStats = useMemo(() => {
    if (rankedItems.length === 0) return null;
    const leader = rankedItems[0];
    const totalVolume = rankedItems.reduce((acc, curr) => acc + curr.value, 0);
    const average = totalVolume / rankedItems.length;

    return {
      leader,
      totalParticipants: rankedItems.length,
      averageFormatted: currentMetric.key === "CHAMADOS"
        ? Math.round(average).toLocaleString("pt-BR")
        : average.toFixed(2).replace(".", ",") + (currentMetric.unit || UNIDADE),
    };
  }, [rankedItems, currentMetric]);

  // Inicia Modo Apresentação em tela cheia
  const handleStartPresentation = () => {
    setIsPresentationMode(true);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // Sai do Modo Apresentação e restaura tela normal
  const handleExitPresentation = () => {
    setIsPresentationMode(false);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const hasHighlight = !!monthHighlight;

  // Se o Modo Apresentação estiver ativo, exibe a experiência de apresentação interativa
  if (isPresentationMode) {
    return (
      <PresentationMode
        operacoes={operacoes}
        angels={angels}
        fotosMap={fotosMap}
        selectedMonth={selectedMonth}
        displayMonth={displayMonth}
        availableMonths={availableMonths}
        onSelectMonth={handleSelectMonth}
        onExit={handleExitPresentation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-q-page p-3 sm:p-5">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1480px] flex-col rounded-q-frame bg-q-frame p-3 sm:min-h-[calc(100vh-2.5rem)] sm:p-5">
        {/* Toast */}
        {refreshToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-q-ink px-4 py-2.5 text-white shadow-2xl">
            <CheckCircle2 className="size-4 text-[#4ade80]" />
            <span className="text-xs font-semibold">{refreshToast}</span>
          </div>
        )}

        <Header
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isLoading={isLoading}
          hasError={!!fetchError}
        />

        <PageHead
          selectedMonth={selectedMonth}
          displayMonth={displayMonth}
          availableMonths={availableMonths}
          onSelectMonth={handleSelectMonth}
          onRefresh={() => fetchData(selectedMonth)}
          isLoading={isLoading}
          onStartPresentation={handleStartPresentation}
        />

        {/* Modo apresentação (tela cheia) banner */}
        {isFullscreen && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-full bg-q-green px-5 py-2.5 text-xs font-semibold text-white">
            <span className="flex items-center gap-2">
              <Tv className="size-4" />
              Modo Reunião • Tela Cheia Ativa
            </span>
            <span className="font-medium text-white/75">Pressione Esc para sair</span>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          <Rail
            metrics={activeMetrics}
            activeMetricKey={activeMetricKey}
            onMetricSelect={setActiveMetricKey}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            onStartPresentation={handleStartPresentation}
          />

          <main className="min-w-0 flex-1">
            {/* Mensagem de Erro bem visível sem dados antigos */}
            {fetchError ? (
              <div className="rounded-q-card bg-q-card border-2 border-[#fca5a5] p-8 sm:p-12 text-center shadow-lg my-4">
                <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-[#fee2e2] text-[#dc2626]">
                  <AlertCircle className="size-8" strokeWidth={2.3} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-q-ink m-0">
                  Falha ao conectar ao banco Supabase
                </h2>
                <p className="mt-2 text-sm text-[#b91c1c] font-semibold max-w-lg mx-auto">
                  {fetchError}
                </p>
                <p className="mt-1 text-xs text-q-muted max-w-md mx-auto">
                  Verifique a conexão de rede ou a disponibilidade da API REST.
                </p>
                <button
                  onClick={() => fetchData(selectedMonth)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-q-green px-6 py-3 text-sm font-bold text-white hover:bg-q-green-deep cursor-pointer transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  <RefreshCw className="size-4" />
                  <span>Tentar novamente</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                {/* Destaque do Mês (cartão verde) */}
                {hasHighlight && (
                  <div className="lg:col-span-8">
                    <MonthHighlight
                      highlight={monthHighlight}
                      referenceMonth={displayMonth}
                      isOperations={isOperations}
                    />
                  </div>
                )}

                {/* Resumo da categoria */}
                <div
                  className={`grid grid-cols-1 gap-4 sm:grid-cols-3 ${
                    hasHighlight ? "lg:col-span-4 lg:grid-cols-1" : "lg:col-span-12"
                  }`}
                >
                  <StatCard
                    icon={<Award className="size-5" strokeWidth={2.3} />}
                    label="Líder da categoria"
                    value={categoryStats?.leader ? categoryStats.leader.displayNome : "—"}
                    badge={categoryStats?.leader?.formattedValue}
                  />
                  <StatCard
                    icon={<TrendingUp className="size-5" strokeWidth={2.3} />}
                    label="Média da operação"
                    value={categoryStats?.averageFormatted || "—"}
                  />
                  <StatCard
                    icon={<Users className="size-5" strokeWidth={2.3} />}
                    label="Participantes avaliados"
                    value={`${categoryStats?.totalParticipants || 0} ${isOperations ? "operações" : "angels"}`}
                  />
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center rounded-q-card bg-q-card py-20 lg:col-span-12 shadow-xs border border-q-line">
                    <div className="mb-4 size-11 animate-spin rounded-full border-4 border-q-green-tint border-t-q-green" />
                    <p className="m-0 text-sm font-bold text-q-ink">Sincronizando com o Supabase...</p>
                    <p className="m-0 mt-1 text-xs text-q-muted">Carregando métricas e fotos em alta resolução</p>
                  </div>
                ) : (
                  <>
                    <div className="lg:col-span-12">
                      <Podium items={rankedItems} metric={currentMetric} isOperations={isOperations} />
                    </div>
                    <div className="lg:col-span-5">
                      <RankingChart items={rankedItems} metric={currentMetric} />
                    </div>
                    <div className="lg:col-span-7">
                      <RankingList items={rankedItems} metric={currentMetric} isOperations={isOperations} />
                    </div>
                  </>
                )}
              </div>
            )}
          </main>
        </div>

        {/* Rodapé com data e hora da atualização */}
        <footer className="mt-6 py-4 text-center text-xs text-q-muted border-t border-q-line/60">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
            <p className="m-0 font-medium">
              {lastUpdated ? (
                <>
                  <span className="inline-block size-2 rounded-full bg-q-green mr-2 align-middle" />
                  Dados atualizados em {formatUpdateDateTime(lastUpdated)}
                </>
              ) : (
                "Carregando dados..."
              )}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleFullscreen}
                className="cursor-pointer transition-colors hover:text-q-green font-semibold"
              >
                {isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
