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
import { SheetSettingsModal } from "./components/SheetSettingsModal";
import {
  ViewMode,
  MetricKey,
  OperationRow,
  AngelRow,
} from "./types";
import { getMetricsForView } from "./utils/metrics";
import { calculateRanking, calculateMonthHighlight } from "./utils/ranking";
import { loadAllSheetData } from "./services/sheetsService";
import { UNIDADE, DEFAULT_SPREADSHEET_ID } from "./config";
import { Button } from "./components/stone-ds";
import {
  AlertCircle,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Tv,
} from "lucide-react";

export default function App() {
  // Estado de Visualização
  const [viewMode, setViewMode] = useState<ViewMode>("OPERACOES");
  const [referenceMonth, setReferenceMonth] = useState<string>("Agosto");
  const [activeMetricKey, setActiveMetricKey] = useState<MetricKey>("CHAMADOS");

  // Armazenamento do ID/URL da planilha no LocalStorage
  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => {
    return localStorage.getItem("sheets_ranking_id") || DEFAULT_SPREADSHEET_ID;
  });

  // Dados brutos carregados
  const [operacoes, setOperacoes] = useState<OperationRow[]>([]);
  const [angels, setAngels] = useState<AngelRow[]>([]);
  const [fotosMap, setFotosMap] = useState<Map<string, string>>(new Map());

  // Estados de controle de carregamento e feedback
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchErrors, setFetchErrors] = useState<string[]>([]);
  const [isUsingSampleData, setIsUsingSampleData] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [refreshToast, setRefreshToast] = useState<string | null>(null);

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

  // Função para carregar os dados das 3 abas (OPERAÇÕES, ANGELS, FOTOS)
  const fetchData = useCallback(async (customId?: string) => {
    setIsLoading(true);
    setFetchErrors([]);
    try {
      const targetId = customId !== undefined ? customId : spreadsheetId;
      const result = await loadAllSheetData(targetId);

      setOperacoes(result.operacoes);
      setAngels(result.angels);
      setFotosMap(result.fotosMap);
      setIsUsingSampleData(result.isSampleData);
      setFetchErrors(result.errors);

      setRefreshToast("Dados sincronizados com a Stone!");
      setTimeout(() => setRefreshToast(null), 3500);
    } catch (err: any) {
      setFetchErrors([err.message || "Erro inesperado ao consultar a planilha."]);
    } finally {
      setIsLoading(false);
    }
  }, [spreadsheetId]);

  // Carrega ao montar a página
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  // Salva nova URL de planilha
  const handleSaveSpreadsheet = (newIdOrUrl: string) => {
    setSpreadsheetId(newIdOrUrl);
    localStorage.setItem("sheets_ranking_id", newIdOrUrl);
    fetchData(newIdOrUrl);
  };

  // Restaura para amostra
  const handleResetToSample = () => {
    setSpreadsheetId("");
    localStorage.removeItem("sheets_ranking_id");
    fetchData("");
  };

  // Métrica ativa atual
  const currentMetric = useMemo(() => {
    return activeMetrics.find((m) => m.key === activeMetricKey) || activeMetrics[0];
  }, [activeMetrics, activeMetricKey]);

  const isOperations = viewMode === "OPERACOES";
  const currentDataset = isOperations ? operacoes : angels;

  // Calcula o ranking da categoria ativa
  const rankedItems = useMemo(() => {
    if (!currentMetric) return [];
    return calculateRanking(currentDataset, currentMetric, fotosMap, isOperations);
  }, [currentDataset, currentMetric, fotosMap, isOperations]);

  // Calcula todos os rankings de todas as categorias para apurar o "Destaque do Mês"
  const allCategoryRankings = useMemo(() => {
    return activeMetrics.map((metric) => ({
      metric,
      rankings: calculateRanking(currentDataset, metric, fotosMap, isOperations),
    }));
  }, [activeMetrics, currentDataset, fotosMap, isOperations]);

  // Destaque do mês (quem mais subiu ao pódio)
  const monthHighlight = useMemo(() => {
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

  const hasHighlight = !!monthHighlight;

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
          isUsingSampleData={isUsingSampleData}
        />

        <PageHead
          referenceMonth={referenceMonth}
          onReferenceMonthChange={setReferenceMonth}
          onRefresh={() => fetchData()}
          isLoading={isLoading}
        />

        {/* Modo apresentação (tela cheia) */}
        {isFullscreen && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-full bg-q-green px-5 py-2.5 text-xs font-semibold text-white">
            <span className="flex items-center gap-2">
              <Tv className="size-4" />
              Modo Apresentação • Reunião de Resultados e Reconhecimentos
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
            onOpenSettings={() => setShowSettingsModal(true)}
          />

          <main className="min-w-0 flex-1">
            {/* Aviso de erro */}
            {fetchErrors.length > 0 && (
              <div className="mb-4 flex flex-col items-start justify-between gap-3 rounded-q-card bg-[#fdeee3] p-4 text-[#a0460a] sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-[#e07020]" />
                  <div>
                    <p className="m-0 text-sm font-bold">Aviso na leitura da planilha:</p>
                    <p className="m-0 mt-0.5 text-xs">{fetchErrors[0]}</p>
                    <p className="m-0 mt-1 text-[11px] text-[#a0460a]/75">
                      Exibindo conjunto de segurança com dados da operação técnica.
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowSettingsModal(true)} className="shrink-0">
                  Verificar Conexão
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Destaque do Mês (cartão verde) */}
              {hasHighlight && (
                <div className="lg:col-span-8">
                  <MonthHighlight
                    highlight={monthHighlight}
                    referenceMonth={referenceMonth}
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
                <div className="flex flex-col items-center justify-center rounded-q-card bg-q-card py-20 lg:col-span-12">
                  <div className="mb-4 size-11 animate-spin rounded-full border-4 border-q-green-tint border-t-q-green" />
                  <p className="m-0 text-sm font-medium text-q-muted">Carregando dados da competição...</p>
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
          </main>
        </div>

        <footer className="mt-4 py-4 text-center text-xs text-q-muted">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
            <p className="m-0">© {new Date().getFullYear()} Stone • Resultados e Reconhecimentos do Atendimento Técnico</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowSettingsModal(true)} className="cursor-pointer transition-colors hover:text-q-green">
                Configurar Planilha
              </button>
              <span>•</span>
              <button onClick={handleToggleFullscreen} className="cursor-pointer transition-colors hover:text-q-green">
                {isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
              </button>
            </div>
          </div>
        </footer>

        <SheetSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          currentSpreadsheetId={spreadsheetId}
          onSave={handleSaveSpreadsheet}
          onResetToSample={handleResetToSample}
          isUsingSampleData={isUsingSampleData}
          errors={fetchErrors}
        />
      </div>
    </div>
  );
}
