/**
 * Motor de Ranking e Cálculos de Reconhecimento
 */

import {
  MetricDefinition,
  MetricKey,
  RankedItem,
  OperationRow,
  AngelRow,
  MonthHighlightData,
} from "../types";
import { formatMetricValue } from "./metrics";
import { findPhotoForName, getInitials } from "./drivePhoto";

/**
 * Normaliza o nome para exibição mais limpa na interface
 * (mantém a sigla do estado e cidade sem poluição)
 */
export function formatDisplayName(name: string, isOperation: boolean = false): string {
  if (!name) return "";
  if (!isOperation) return name;

  // Para operações como "RN - JOAO CAMARA FRANQUIA", pode exibir sem a palavra FRANQUIA
  return name.replace(/\bFRANQUIA\b/gi, "").trim();
}

/**
 * Calcula o ranking para uma métrica específica
 */
export function calculateRanking(
  rows: (OperationRow | AngelRow)[],
  metric: MetricDefinition,
  photosMap: Map<string, string>,
  isOperation: boolean
): RankedItem[] {
  // Extrai valor de cada linha
  const mapped: RankedItem[] = rows
    .map((row) => {
      let val = 0;
      switch (metric.key) {
        case "CHAMADOS":
          val = row.chamados;
          break;
        case "TMA_STONE":
          val = row.tmaStone;
          break;
        case "TMA_TON":
          val = row.tmaTon;
          break;
        case "TMA_BOBINA":
          val = row.tmaBobina;
          break;
        case "CICLO_TRIAGEM":
          val = "cicloTriagem" in row ? (row as OperationRow).cicloTriagem : 0;
          break;
      }

      const photoUrl = findPhotoForName(row.nome, photosMap, isOperation);
      const displayNome = formatDisplayName(row.nome, isOperation);
      const avatarFallback = getInitials(row.nome, isOperation);

      return {
        id: row.nome,
        nome: row.nome,
        displayNome,
        value: val,
        rank: 1,
        formattedValue: "",
        photoUrl,
        avatarFallback,
        isTied: false,
        deltaFromLeader: undefined,
        metricKey: metric.key,
      };
    })
    // Filtra casos onde o valor é 0 para métricas de tempo se necessário, ou inclui todos com dados válidos
    .filter((item) => !isNaN(item.value));

  // Ordenação de acordo com as regras:
  // CHAMADOS: maior é melhor (descendente)
  // TMA STONE, TMA TON, TMA BOBINA, CICLO TRIAGEM: menor é melhor (ascendente)
  mapped.sort((a, b) => {
    if (metric.direction === "higher_is_better") {
      return b.value - a.value;
    } else {
      return a.value - b.value;
    }
  });

  // Atribuição de posições com tratamento de empate (ex: 1, 2, 2, 4)
  for (let i = 0; i < mapped.length; i++) {
    const current = mapped[i];
    if (i === 0) {
      current.rank = 1;
      current.isTied = false;
    } else {
      const prev = mapped[i - 1];
      // Comparação com tolerância float para precisão decimal
      if (Math.abs(current.value - prev.value) < 0.00001) {
        current.rank = prev.rank;
        current.isTied = true;
        prev.isTied = true;
      } else {
        current.rank = i + 1;
        current.isTied = false;
      }
    }
    current.formattedValue = formatMetricValue(current.value, metric);
  }

  // Calcula delta em relação ao líder (1º lugar)
  if (mapped.length > 0) {
    const leaderValue = mapped[0].value;
    mapped.forEach((item) => {
      item.deltaFromLeader = item.value - leaderValue;
    });
  }

  return mapped;
}

/**
 * Calcula o Destaque do Mês (MVP):
 * Quem mais apareceu no pódio (top 3) entre todas as categorias ativas!
 */
export function calculateMonthHighlight(
  allCategoryRankings: { metric: MetricDefinition; rankings: RankedItem[] }[],
  photosMap: Map<string, string>,
  isOperation: boolean
): MonthHighlightData | null {
  if (allCategoryRankings.length === 0) return null;

  interface CandidateStats {
    nome: string;
    displayNome: string;
    photoUrl?: string;
    avatarFallback: string;
    firstPlaceCount: number;
    secondPlaceCount: number;
    thirdPlaceCount: number;
    totalPodiums: number;
    score: number; // 3 pts para 1º, 2 pts para 2º, 1 pt para 3º
    appearances: {
      categoryKey: MetricKey;
      categoryLabel: string;
      rank: number;
      valueFormatted: string;
    }[];
  }

  const map = new Map<string, CandidateStats>();

  allCategoryRankings.forEach(({ metric, rankings }) => {
    // Pega todos no pódio (rank <= 3)
    const podiumItems = rankings.filter((r) => r.rank <= 3);

    podiumItems.forEach((item) => {
      if (!map.has(item.nome)) {
        map.set(item.nome, {
          nome: item.nome,
          displayNome: item.displayNome,
          photoUrl: item.photoUrl,
          avatarFallback: item.avatarFallback,
          firstPlaceCount: 0,
          secondPlaceCount: 0,
          thirdPlaceCount: 0,
          totalPodiums: 0,
          score: 0,
          appearances: [],
        });
      }

      const stats = map.get(item.nome)!;
      stats.totalPodiums += 1;

      if (item.rank === 1) {
        stats.firstPlaceCount += 1;
        stats.score += 3;
      } else if (item.rank === 2) {
        stats.secondPlaceCount += 1;
        stats.score += 2;
      } else if (item.rank === 3) {
        stats.thirdPlaceCount += 1;
        stats.score += 1;
      }

      stats.appearances.push({
        categoryKey: metric.key,
        categoryLabel: metric.shortLabel,
        rank: item.rank,
        valueFormatted: item.formattedValue,
      });
    });
  });

  const candidates = Array.from(map.values());
  if (candidates.length === 0) return null;

  // Ordena pelo critério:
  // 1. Mais aparições no pódio (totalPodiums)
  // 2. Mais 1º lugares
  // 3. Mais 2º lugares
  // 4. Maior pontuação ponderada (score)
  candidates.sort((a, b) => {
    if (b.totalPodiums !== a.totalPodiums) {
      return b.totalPodiums - a.totalPodiums;
    }
    if (b.firstPlaceCount !== a.firstPlaceCount) {
      return b.firstPlaceCount - a.firstPlaceCount;
    }
    if (b.secondPlaceCount !== a.secondPlaceCount) {
      return b.secondPlaceCount - a.secondPlaceCount;
    }
    return b.score - a.score;
  });

  const winner = candidates[0];

  let summaryNote = "";
  if (winner.totalPodiums === allCategoryRankings.length) {
    summaryNote = `Presença unânime em 100% dos pódios (${winner.totalPodiums} de ${allCategoryRankings.length} categorias)!`;
  } else if (winner.firstPlaceCount > 1) {
    summaryNote = `Liderança expressiva com ${winner.firstPlaceCount} primeiros lugares e ${winner.totalPodiums} pódios conquistados!`;
  } else {
    summaryNote = `Maior regularidade de alta performance com ${winner.totalPodiums} presenças no pódio!`;
  }

  return {
    nome: winner.nome,
    displayNome: winner.displayNome,
    photoUrl: winner.photoUrl,
    avatarFallback: winner.avatarFallback,
    totalPodiums: winner.totalPodiums,
    firstPlaceCount: winner.firstPlaceCount,
    secondPlaceCount: winner.secondPlaceCount,
    thirdPlaceCount: winner.thirdPlaceCount,
    score: winner.score,
    appearances: winner.appearances,
    summaryNote,
  };
}
