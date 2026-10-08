/**
 * Serviço de integração com Google Sheets (via exportação pública CSV)
 */

import { OperationRow, AngelRow } from "../types";
import { parseOperacoesCsv, parseAngelsCsv, parseFotosCsv } from "../utils/csvParser";
import {
  SAMPLE_OPERACOES_CSV,
  SAMPLE_ANGELS_CSV,
  SAMPLE_FOTOS_CSV,
} from "../data/sampleData";

export interface FetchResult {
  operacoes: OperationRow[];
  angels: AngelRow[];
  fotosMap: Map<string, string>;
  isSampleData: boolean;
  errors: string[];
}

/**
 * Extrai o ID da planilha a partir de uma URL do Google Sheets ou string de ID
 */
export function extractSpreadsheetId(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();

  // Se já for apenas o ID (sem barras)
  if (!trimmed.includes("/") && trimmed.length >= 20) {
    return trimmed;
  }

  // Padrão: /spreadsheets/d/([a-zA-Z0-9_-]+)
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }

  return trimmed;
}

/**
 * Gera as URLs de CSV para uma determinada aba da planilha
 */
export function buildSheetCsvUrls(spreadsheetId: string, sheetName: string): string[] {
  const encodedName = encodeURIComponent(sheetName);
  return [
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodedName}`,
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&sheet=${encodedName}`,
  ];
}

/**
 * Faz fetch de uma aba com fallback e timeout
 */
async function fetchTabCsv(spreadsheetId: string, sheetName: string): Promise<string> {
  const urls = buildSheetCsvUrls(spreadsheetId, sheetName);
  let lastError: Error | null = null;

  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "text/csv, text/plain, */*",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ao carregar aba "${sheetName}"`);
      }

      const text = await response.text();

      // Verifica se o Google retornou página HTML de login em vez de CSV
      if (text.includes("<!DOCTYPE html") || text.includes("<html") || text.includes("accounts.google.com")) {
        throw new Error(
          `A planilha precisa estar com acesso público ("Qualquer pessoa com o link pode ler").`
        );
      }

      return text;
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Não foi possível carregar a aba "${sheetName}"`);
}

/**
 * Carrega todos os dados: OPERAÇÕES, ANGELS e FOTOS
 */
export async function loadAllSheetData(
  spreadsheetIdOrUrl: string,
  tabNames = {
    operacoes: "OPERAÇÕES",
    angels: "ANGELS",
    fotos: "FOTOS",
  }
): Promise<FetchResult> {
  const cleanId = extractSpreadsheetId(spreadsheetIdOrUrl);
  const errors: string[] = [];

  // Se nenhum ID configurado, usa dados de exemplo fornecidos
  if (!cleanId) {
    return {
      operacoes: parseOperacoesCsv(SAMPLE_OPERACOES_CSV),
      angels: parseAngelsCsv(SAMPLE_ANGELS_CSV),
      fotosMap: parseFotosCsv(SAMPLE_FOTOS_CSV),
      isSampleData: true,
      errors: [],
    };
  }

  let operacoesData: OperationRow[] = [];
  let angelsData: AngelRow[] = [];
  let fotosMapData = new Map<string, string>();

  // Executa busca paralela das 3 abas
  const [resOperacoes, resAngels, resFotos] = await Promise.allSettled([
    fetchTabCsv(cleanId, tabNames.operacoes),
    fetchTabCsv(cleanId, tabNames.angels),
    fetchTabCsv(cleanId, tabNames.fotos),
  ]);

  if (resOperacoes.status === "fulfilled") {
    operacoesData = parseOperacoesCsv(resOperacoes.value);
  } else {
    errors.push(`Erro na aba "${tabNames.operacoes}": ${resOperacoes.reason?.message || "Falha na leitura"}`);
    // Fallback gracioso para a amostra para não deixar tela quebrada
    operacoesData = parseOperacoesCsv(SAMPLE_OPERACOES_CSV);
  }

  if (resAngels.status === "fulfilled") {
    angelsData = parseAngelsCsv(resAngels.value);
  } else {
    errors.push(`Erro na aba "${tabNames.angels}": ${resAngels.reason?.message || "Falha na leitura"}`);
    angelsData = parseAngelsCsv(SAMPLE_ANGELS_CSV);
  }

  if (resFotos.status === "fulfilled") {
    fotosMapData = parseFotosCsv(resFotos.value);
  } else {
    // Foto é opcional, se falhar não quebra
    fotosMapData = parseFotosCsv(SAMPLE_FOTOS_CSV);
  }

  const isSampleData = errors.length >= 2;

  return {
    operacoes: operacoesData,
    angels: angelsData,
    fotosMap: fotosMapData,
    isSampleData,
    errors,
  };
}
