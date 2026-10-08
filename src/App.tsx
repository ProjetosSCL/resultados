/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "./components/Header";
import { Podium } from "./components/Podium";
import { RankingChart } from "./components/RankingChart";
import { RankingList } from "./components/RankingList";
import { MonthHighlight } from "./components/MonthHighlight";
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
import {
  Card,
  Display,
  Text,
  Button,
} from "./components/stone-ds";
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

  return (
    <div className="min-h-screen bg-[#1E281E] text-[#F5FFF5] flex flex-col selection:bg-[#00D700] selection:text-[#00461E]">
      {/* Toast Notification Stone */}
      {refreshToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#00461E] border-2 border-[#00D700] text-[#A5FA00] px-4 py-2.5 rounded-stone-pill shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-[#00D700]" />
          <span className="text-xs font-bold font-body">{refreshToast}</span>
        </div>
      )}

      {/* Top Header & Navigation */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        referenceMonth={referenceMonth}
        onReferenceMonthChange={setReferenceMonth}
        metrics={activeMetrics}
        activeMetricKey={activeMetricKey}
        onMetricSelect={setActiveMetricKey}
        onRefresh={() => fetchData()}
        isLoading={isLoading}
        onOpenSettings={() => setShowSettingsModal(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Presentation Mode Top Bar (when in Fullscreen) */}
      {isFullscreen && (
        <div className="bg-[#00461E] border-b-2 border-[#00D700] px-6 py-2 text-center text-xs text-[#A5FA00] font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-[#00D700]" />
            <span className="font-display uppercase tracking-wider">
              Modo Apresentação Stone • Reunião de Resultados e Reconhecimentos
            </span>
          </div>
          <span className="text-[#C8D2C8] text-[11px] font-body">
            Pressione Esc ou clique em "Sair Tela Cheia" para fechar
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Banner de Aviso de Erro ou Amostra */}
        {fetchErrors.length > 0 && (
          <div className="mb-6 p-4 rounded-stone-md bg-[#00461E]/80 border-2 border-[#FF8232] text-[#FFA53C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FF8232] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm font-body">Aviso na leitura da planilha:</p>
                <p className="text-xs text-[#FFA53C]/90 mt-0.5 font-body">
                  {fetchErrors[0]}
                </p>
                <p className="text-[11px] text-[#C8D2C8] mt-1 font-body">
                  Exibindo conjunto de segurança com dados da operação técnica.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettingsModal(true)}
              className="text-xs shrink-0 border-[#FF8232] text-[#FFA53C] hover:bg-[#FF8232]/10"
            >
              Verificar Conexão
            </Button>
          </div>
        )}

        {/* Card Destaque do Mês (MVP que mais subiu ao pódio) */}
        <MonthHighlight
          highlight={monthHighlight}
          referenceMonth={referenceMonth}
          isOperations={isOperations}
        />

        {/* Categoria Ativa - Barra de Contexto e Estatísticas (Cards Stone DS) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          <Card layout="principal" tone="surface" className="p-4! border border-[#007D00]/50 flex items-center gap-3.5">
            <div className="p-2.5 rounded-stone-md bg-[#00D700] text-[#00461E]">
              <Award className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#C8D2C8] tracking-wider block font-body">
                Líder da Categoria
              </span>
              <Display as="span" width="condensed" uppercase={false} className="text-base font-bold text-[#F5FFF5] truncate block">
                {categoryStats?.leader ? categoryStats.leader.displayNome : "—"}
              </Display>
            </div>
          </Card>

          <Card layout="principal" tone="surface" className="p-4! border border-[#007D00]/50 flex items-center gap-3.5">
            <div className="p-2.5 rounded-stone-md bg-[#00461E] border border-[#007D00] text-[#A5FA00]">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#C8D2C8] tracking-wider block font-body">
                Média da Operação
              </span>
              <Display as="span" width="condensed" className="text-base font-bold text-[#A5FA00] block">
                {categoryStats?.averageFormatted || "—"}
              </Display>
            </div>
          </Card>

          <Card layout="principal" tone="surface" className="p-4! border border-[#007D00]/50 flex items-center gap-3.5">
            <div className="p-2.5 rounded-stone-md bg-[#00461E] border border-[#007D00] text-[#00D700]">
              <Users className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#C8D2C8] tracking-wider block font-body">
                Participantes Avaliados
              </span>
              <Display as="span" width="condensed" className="text-base font-bold text-[#00D700] block">
                {categoryStats?.totalParticipants || 0}{" "}
                {isOperations ? "Operações" : "Angels"}
              </Display>
            </div>
          </Card>
        </div>

        {/* 1. O PÓDIO (Top 3 em Ouro, Prata, Bronze) */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00D700]/30 border-t-[#00D700] rounded-stone-pill animate-spin mb-4" />
            <Text className="text-[#C8D2C8] text-sm font-medium">Carregando dados da competição...</Text>
          </div>
        ) : (
          <>
            <Podium
              items={rankedItems}
              metric={currentMetric}
              isOperations={isOperations}
            />

            {/* 2. GRÁFICO DE BARRAS HORIZONTAIS COMPLETO */}
            <RankingChart
              items={rankedItems}
              metric={currentMetric}
            />

            {/* 3. LISTA DAS DEMAIS POSIÇÕES */}
            <RankingList
              items={rankedItems}
              metric={currentMetric}
              isOperations={isOperations}
            />
          </>
        )}
      </main>

      {/* Footer Stone DS */}
      <footer className="border-t border-[#00461E] bg-[#1E281E] py-6 text-center text-xs text-[#96A096]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body">© {new Date().getFullYear()} Stone • Resultados e Reconhecimentos do Atendimento Técnico</p>
          <div className="flex items-center gap-4 text-[#C8D2C8] font-body">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="hover:text-[#00D700] transition-colors cursor-pointer"
            >
              Configurar Planilha
            </button>
            <span>•</span>
            <button
              onClick={handleToggleFullscreen}
              className="hover:text-[#00D700] transition-colors cursor-pointer"
            >
              {isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
            </button>
          </div>
        </div>
      </footer>

      {/* Modal de Configuração da Planilha Google Sheets */}
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
  );
}
