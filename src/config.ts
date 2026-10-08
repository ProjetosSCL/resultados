/**
 * Configuração global do painel de resultados
 */

// Os tempos TMA não têm unidade definida: constante vazia por padrão.
// Pode ser alterada para " min", "h", "s", etc.
export const UNIDADE = "";

// ID padrão da planilha do Google Sheets (se o usuário configurar uma planilha pública)
// Se vazio, usa os dados da operação fornecidos como base inicial
export const DEFAULT_SPREADSHEET_ID = "";

// Nomes das abas esperadas no Google Sheets
export const SHEET_TABS = {
  OPERACOES: "OPERAÇÕES",
  ANGELS: "ANGELS",
  FOTOS: "FOTOS",
} as const;
