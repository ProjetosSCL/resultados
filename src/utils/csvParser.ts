/**
 * Parser de CSV resiliente para planilhas do Google Sheets
 */

import { OperationRow, AngelRow, PhotoRow } from "../types";
import { convertDriveUrlToThumbnail, normalizeNameForMatching } from "./drivePhoto";

/**
 * Converte string CSV bruta em matriz de strings [linhas][colunas],
 * respeitando aspas duplas, quebras de linha e vírgulas internas.
 */
export function parseCsvToGrid(csvText: string): string[][] {
  const cleanText = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Aspas escapadas ("")
          currentCell += '"';
          i++; // pula a próxima aspa
        } else {
          // Fim do bloco de aspas
          inQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if (char === "\n") {
        currentRow.push(currentCell.trim());
        // Apenas adiciona linha se não estiver totalmente vazia
        if (currentRow.some((c) => c !== "")) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = "";
      } else {
        currentCell += char;
      }
    }
  }

  // Última célula pendente
  if (currentCell !== "" || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c !== "")) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Converte valor numérico formatado com vírgula (ex: "2,47", "911", " 0,49 ") em float JS
 */
export function parseCommaNumber(value: string | undefined): number {
  if (!value) return 0;
  
  // Remove aspas, espaços e caracteres invisíveis
  let s = value.replace(/["']/g, "").trim();
  if (!s || s === "-" || s === "N/A" || s === "null") return 0;

  // Se já for numérico normal
  // Trata separador de milhar ponto e decimal vírgula (ex: 1.234,56 ou apenas 2,47)
  if (s.includes(",") && s.includes(".")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  }

  const parsed = parseFloat(s);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Normaliza um cabeçalho para comparação:
 * sem acentos, sem pontuação, minúsculas e sem espaços extras
 */
export function normalizeHeader(header: string): string {
  if (!header) return "";
  return header
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Parser para a aba OPERAÇÕES
 */
export function parseOperacoesCsv(csvText: string): OperationRow[] {
  const grid = parseCsvToGrid(csvText);
  if (grid.length < 2) return [];

  const headers = grid[0].map(normalizeHeader);
  const dataRows = grid.slice(1);

  // Mapeamento dos índices das colunas
  // Regra: "primeira coluna é o nome da operação"
  let colNome = 0;
  let colChamados = -1;
  let colStone = -1;
  let colTon = -1;
  let colBobina = -1;
  let colCiclo = -1;

  headers.forEach((h, idx) => {
    if (h.includes("chamado")) colChamados = idx;
    else if (h.includes("stone")) colStone = idx;
    else if (h.includes("ton")) colTon = idx;
    else if (h.includes("bobina")) colBobina = idx;
    else if (h.includes("ciclo") || h.includes("triagem")) colCiclo = idx;
  });

  // Fallbacks por posição se não identificou pelos nomes
  if (colChamados === -1 && headers.length > 1) colChamados = 1;
  if (colStone === -1 && headers.length > 2) colStone = 2;
  if (colTon === -1 && headers.length > 3) colTon = 3;
  if (colBobina === -1 && headers.length > 4) colBobina = 4;
  if (colCiclo === -1 && headers.length > 5) colCiclo = 5;

  const result: OperationRow[] = [];

  for (const row of dataRows) {
    const rawNome = row[colNome]?.trim();
    if (!rawNome) continue; // Ignora linhas vazias

    const chamados = colChamados >= 0 ? parseCommaNumber(row[colChamados]) : 0;
    const tmaStone = colStone >= 0 ? parseCommaNumber(row[colStone]) : 0;
    const tmaTon = colTon >= 0 ? parseCommaNumber(row[colTon]) : 0;
    const tmaBobina = colBobina >= 0 ? parseCommaNumber(row[colBobina]) : 0;
    const cicloTriagem = colCiclo >= 0 ? parseCommaNumber(row[colCiclo]) : 0;

    const raw: Record<string, string> = {};
    headers.forEach((h, i) => {
      raw[h] = row[i] || "";
    });

    result.push({
      nome: rawNome,
      chamados,
      tmaStone,
      tmaTon,
      tmaBobina,
      cicloTriagem,
      raw,
    });
  }

  return result;
}

/**
 * Parser para a aba ANGELS
 */
export function parseAngelsCsv(csvText: string): AngelRow[] {
  const grid = parseCsvToGrid(csvText);
  if (grid.length < 2) return [];

  const headers = grid[0].map(normalizeHeader);
  const dataRows = grid.slice(1);

  let colNome = -1;
  let colChamados = -1;
  let colStone = -1;
  let colTon = -1;
  let colBobina = -1;

  headers.forEach((h, idx) => {
    if (h.includes("green") || h.includes("angel") || h.includes("nome") || h.includes("tecnico")) {
      colNome = idx;
    } else if (h.includes("chamado")) {
      colChamados = idx;
    } else if (h.includes("stone")) {
      colStone = idx;
    } else if (h.includes("ton")) {
      colTon = idx;
    } else if (h.includes("bobina")) {
      colBobina = idx;
    }
  });

  // Fallbacks por posição
  if (colNome === -1) colNome = 0;
  if (colChamados === -1 && headers.length > 1) colChamados = 1;
  if (colStone === -1 && headers.length > 2) colStone = 2;
  if (colTon === -1 && headers.length > 3) colTon = 3;
  if (colBobina === -1 && headers.length > 4) colBobina = 4;

  const result: AngelRow[] = [];

  for (const row of dataRows) {
    const rawNome = row[colNome]?.trim();
    if (!rawNome) continue;

    const chamados = colChamados >= 0 ? parseCommaNumber(row[colChamados]) : 0;
    const tmaStone = colStone >= 0 ? parseCommaNumber(row[colStone]) : 0;
    const tmaTon = colTon >= 0 ? parseCommaNumber(row[colTon]) : 0;
    const tmaBobina = colBobina >= 0 ? parseCommaNumber(row[colBobina]) : 0;

    const raw: Record<string, string> = {};
    headers.forEach((h, i) => {
      raw[h] = row[i] || "";
    });

    result.push({
      nome: rawNome,
      chamados,
      tmaStone,
      tmaTon,
      tmaBobina,
      raw,
    });
  }

  return result;
}

/**
 * Parser para a aba FOTOS
 */
export function parseFotosCsv(csvText: string): Map<string, string> {
  const grid = parseCsvToGrid(csvText);
  const map = new Map<string, string>();
  if (grid.length < 2) return map;

  const headers = grid[0].map(normalizeHeader);
  const dataRows = grid.slice(1);

  let colNome = -1;
  let colLink = -1;

  headers.forEach((h, idx) => {
    if (h.includes("nome") || h.includes("operacao") || h.includes("angel")) colNome = idx;
    else if (h.includes("link") || h.includes("foto") || h.includes("drive") || h.includes("url")) colLink = idx;
  });

  if (colNome === -1) colNome = 0;
  if (colLink === -1 && headers.length > 1) colLink = 1;

  for (const row of dataRows) {
    const rawNome = row[colNome]?.trim();
    const rawLink = row[colLink]?.trim();
    if (!rawNome || !rawLink) continue;

    const thumbnailUrl = convertDriveUrlToThumbnail(rawLink);
    if (thumbnailUrl) {
      // Indexa por chave normalizada (sem franquia para permitir match direto)
      const keyNormal = normalizeNameForMatching(rawNome, false);
      const keyWithoutFranquia = normalizeNameForMatching(rawNome, true);
      
      map.set(keyNormal, thumbnailUrl);
      if (keyWithoutFranquia && keyWithoutFranquia !== keyNormal) {
        map.set(keyWithoutFranquia, thumbnailUrl);
      }
    }
  }

  return map;
}
