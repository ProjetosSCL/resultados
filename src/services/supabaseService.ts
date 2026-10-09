/**
 * Serviço de integração com Supabase (API REST)
 * Substitui o Google Sheets e dados de exemplo.
 */

import { OperationRow, AngelRow } from "../types";
import { convertDriveUrlToThumbnail, normalizeNameForMatching } from "../utils/drivePhoto";

export const SUPABASE_URL = "https://dskwsljwtdvbvhytpltn.supabase.co";
export const SUPABASE_KEY = "sb_publishable_wgl0TOxoSIk-R3k99qbSRQ_woBHhtOd"; // chave pública

export const MONTH_NAMES = [
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

export interface SupabaseResultadoRow {
  id?: number;
  mes: string;
  tipo: "operacao" | "angel" | string;
  nome: string;
  chamados: number;
  tma_stone: number;
  tma_ton: number;
  tma_bobina: number;
  ciclo_triagem: number | null;
}

export interface SupabaseFotoRow {
  id?: number;
  nome: string;
  url: string;
}

export interface SupabaseFetchResult {
  rawMonth: string;
  displayMonth: string;
  monthName: string;
  year: string;
  availableMonths: string[];
  operacoes: OperationRow[];
  angels: AngelRow[];
  fotosMap: Map<string, string>;
  updatedAt: Date;
}

/**
 * Converte valor de mês ("2026-09" ou "Setembro/2026") para exibição amigável "Setembro/2026"
 */
export function formatMonthDisplay(rawMes: string): string {
  if (!rawMes) return "";
  const match = rawMes.match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const year = match[1];
    const monthNum = parseInt(match[2], 10);
    const monthName = MONTH_NAMES[monthNum - 1] || match[2];
    return `${monthName}/${year}`;
  }
  return rawMes;
}

/**
 * Extrai nome do mês e ano separados
 */
export function parseMonthParts(rawMes: string): { monthName: string; year: string; display: string } {
  if (!rawMes) return { monthName: "", year: "", display: "" };
  const match = rawMes.match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const year = match[1];
    const monthNum = parseInt(match[2], 10);
    const monthName = MONTH_NAMES[monthNum - 1] || match[2];
    return { monthName, year, display: `${monthName}/${year}` };
  }

  const slashMatch = rawMes.match(/^([a-zA-ZÀ-ÿ]+)\/(\d{4})$/);
  if (slashMatch) {
    return { monthName: slashMatch[1], year: slashMatch[2], display: rawMes };
  }

  return { monthName: rawMes, year: "", display: rawMes };
}

/**
 * Formata data e hora para exibição no rodapé: "Dados atualizados em DD/MM/AAAA às HH:mm"
 */
export function formatUpdateDateTime(date: Date): string {
  const d = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const t = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${d} às ${t}`;
}

/**
 * Ordena meses do mais recente para o mais antigo
 */
export function sortMonthsDesc(months: string[]): string[] {
  return [...months].sort((a, b) => {
    // Se ambos forem YYYY-MM
    if (/^\d{4}-\d{2}$/.test(a) && /^\d{4}-\d{2}$/.test(b)) {
      return b.localeCompare(a);
    }
    const parseVal = (str: string) => {
      const ym = str.match(/^(\d{4})-(\d{2})$/);
      if (ym) return parseInt(ym[1], 10) * 100 + parseInt(ym[2], 10);
      const slash = str.match(/^([a-zA-ZÀ-ÿ]+)\/(\d{4})$/);
      if (slash) {
        const mIdx = MONTH_NAMES.findIndex(
          (m) => m.toLowerCase() === slash[1].toLowerCase()
        );
        return parseInt(slash[2], 10) * 100 + (mIdx >= 0 ? mIdx + 1 : 0);
      }
      return 0;
    };
    return parseVal(b) - parseVal(a);
  });
}

/**
 * Busca a lista de meses disponíveis na tabela resultados
 */
export async function fetchAvailableMonths(): Promise<string[]> {
  const url = `${SUPABASE_URL}/rest/v1/resultados?select=mes`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      apikey: SUPABASE_KEY,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar meses disponíveis (HTTP ${response.status})`);
  }

  const data: { mes: string }[] = await response.json();
  const rawList = Array.from(new Set(data.map((item) => item.mes).filter(Boolean)));
  return sortMonthsDesc(rawList);
}

/**
 * Busca todas as fotos e retorna mapa indexado por nomes normalizados
 */
export async function fetchFotosMap(): Promise<Map<string, string>> {
  const url = `${SUPABASE_URL}/rest/v1/fotos?select=*`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      apikey: SUPABASE_KEY,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar fotos no Supabase (HTTP ${response.status})`);
  }

  const data: SupabaseFotoRow[] = await response.json();
  const map = new Map<string, string>();

  for (const item of data) {
    if (!item.nome || !item.url) continue;
    const thumbUrl = convertDriveUrlToThumbnail(item.url);
    if (!thumbUrl) continue;

    // Normaliza chave com e sem a palavra FRANQUIA para casar com operações
    const keyNormal = normalizeNameForMatching(item.nome, false);
    const keyWithoutFranquia = normalizeNameForMatching(item.nome, true);

    map.set(keyNormal, thumbUrl);
    if (keyWithoutFranquia && keyWithoutFranquia !== keyNormal) {
      map.set(keyWithoutFranquia, thumbUrl);
    }
  }

  return map;
}

/**
 * Busca resultados do mês específico e separa por tipo ("operacao" e "angel")
 */
export async function fetchMonthResults(
  mes: string
): Promise<{ operacoes: OperationRow[]; angels: AngelRow[] }> {
  const url = `${SUPABASE_URL}/rest/v1/resultados?mes=eq.${encodeURIComponent(
    mes
  )}&select=*`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      apikey: SUPABASE_KEY,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar resultados do mês ${mes} (HTTP ${response.status})`
    );
  }

  const rows: SupabaseResultadoRow[] = await response.json();

  const operacoes: OperationRow[] = rows
    .filter((r) => r.tipo === "operacao")
    .map((r) => ({
      nome: r.nome || "",
      chamados: Number(r.chamados) || 0,
      tmaStone: Number(r.tma_stone) || 0,
      tmaTon: Number(r.tma_ton) || 0,
      tmaBobina: Number(r.tma_bobina) || 0,
      cicloTriagem: r.ciclo_triagem !== null && r.ciclo_triagem !== undefined ? Number(r.ciclo_triagem) : 0,
      raw: r as any,
    }));

  const angels: AngelRow[] = rows
    .filter((r) => r.tipo === "angel")
    .map((r) => ({
      nome: r.nome || "",
      chamados: Number(r.chamados) || 0,
      tmaStone: Number(r.tma_stone) || 0,
      tmaTon: Number(r.tma_ton) || 0,
      tmaBobina: Number(r.tma_bobina) || 0,
      raw: r as any,
    }));

  return { operacoes, angels };
}

/**
 * Carrega todos os dados do painel pelo Supabase:
 * - Lista de meses disponíveis
 * - Se mes não informado, usa o mais recente
 * - Resultados do mês e fotos em paralelo
 */
export async function loadSupabaseData(
  targetMonth?: string
): Promise<SupabaseFetchResult> {
  // 1. Obtém meses disponíveis
  const availableMonths = await fetchAvailableMonths();
  if (availableMonths.length === 0) {
    throw new Error("Nenhum mês de resultado cadastrado no banco Supabase.");
  }

  // 2. Determina o mês selecionado (o mais recente se não especificado ou se inválido)
  const chosenMonth =
    targetMonth && availableMonths.includes(targetMonth)
      ? targetMonth
      : availableMonths[0];

  // 3. Busca fotos e resultados do mês em paralelo
  const [fotosMap, { operacoes, angels }] = await Promise.all([
    fetchFotosMap(),
    fetchMonthResults(chosenMonth),
  ]);

  const { monthName, year, display } = parseMonthParts(chosenMonth);

  return {
    rawMonth: chosenMonth,
    displayMonth: display,
    monthName,
    year,
    availableMonths,
    operacoes,
    angels,
    fotosMap,
    updatedAt: new Date(),
  };
}
