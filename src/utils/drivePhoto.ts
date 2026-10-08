/**
 * Utilitários para normalização de nomes e extração de fotos do Google Drive
 */

/**
 * Extrai o ID do arquivo do Google Drive a partir de qualquer formato de link conhecido
 * e retorna a URL direta da thumbnail em alta resolução.
 */
export function convertDriveUrlToThumbnail(urlOrId: string | undefined): string | undefined {
  if (!urlOrId || typeof urlOrId !== "string") return undefined;
  
  const trimmed = urlOrId.trim();
  if (!trimmed) return undefined;

  // Se já for uma URL de thumbnail com o parâmetro sz, atualiza para sz=w600
  if (trimmed.includes("drive.google.com/thumbnail?id=")) {
    try {
      const urlObj = new URL(trimmed);
      const id = urlObj.searchParams.get("id");
      if (id) {
        return `https://drive.google.com/thumbnail?id=${id}&sz=w600`;
      }
    } catch {
      // Fallback para regex
    }
  }

  let fileId = "";

  // 1. Formato: /file/d/{FILE_ID}/...
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    fileId = fileDMatch[1];
  }

  // 2. Formato: id={FILE_ID} em query string (open?id=, uc?id=, thumbnail?id=)
  if (!fileId) {
    const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch && idParamMatch[1]) {
      fileId = idParamMatch[1];
    }
  }

  // 3. Formato: /d/{FILE_ID}/
  if (!fileId) {
    const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (dMatch && dMatch[1]) {
      fileId = dMatch[1];
    }
  }

  // 4. Se o usuário inseriu diretamente o ID (comprimento típico do Google Drive > 20 chars alfanumérico)
  if (!fileId && !trimmed.includes("/") && trimmed.length >= 20) {
    fileId = trimmed;
  }

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`;
  }

  // Se for uma URL de imagem direta genérica (http/https), preserva
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return undefined;
}

/**
 * Normaliza um texto para busca:
 * - Remove acentos
 * - Minúsculas
 * - Remove caracteres especiais excedentes
 * - Colapsa espaços múltiplos
 * - Remove opcionalmente a palavra "FRANQUIA" para operações
 */
export function normalizeNameForMatching(name: string, isOperation: boolean = false): string {
  if (!name) return "";
  
  let clean = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentuações
    .toLowerCase();

  if (isOperation) {
    // Remove a palavra FRANQUIA (com ou sem 's' ou pontuação)
    clean = clean.replace(/\bfranquias?\b/g, " ");
  }

  // Substitui hífens e traços por espaços para equivalência "RN - JOAO CAMARA" == "RN JOAO CAMARA"
  clean = clean.replace(/[-–—_]/g, " ");

  // Remove caracteres especiais exceto letras, números e espaços
  clean = clean.replace(/[^a-z0-9\s]/g, "");

  // Colapsa espaços múltiplos e apara pontas
  return clean.replace(/\s+/g, " ").trim();
}

/**
 * Gera iniciais limpas para o avatar de fallback
 */
export function getInitials(name: string, isOperation: boolean = false): string {
  if (!name) return "??";
  
  let clean = name.trim();
  
  if (isOperation) {
    // Para operações como "RN - JOAO CAMARA FRANQUIA", remova prefixos de estado se conveniente,
    // ou use a sigla do estado + primeira letra da cidade
    const parts = clean.split(/[-–—]/).map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const state = parts[0].replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
      const cityWords = parts[1].replace(/franquia/i, "").trim().split(/\s+/).filter(Boolean);
      const firstCity = cityWords[0]?.[0] || "";
      if (state && firstCity) {
        return `${state[0]}${firstCity}`.toUpperCase();
      }
    }
  }

  const words = clean
    .replace(/franquia/i, "")
    .replace(/[-–—]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !["de", "da", "do", "dos", "das", "e"].includes(w.toLowerCase()));

  if (words.length === 0) {
    return clean.slice(0, 2).toUpperCase();
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

/**
 * Encontra a URL da foto no mapa de fotos pelo nome
 */
export function findPhotoForName(
  targetName: string,
  photosMap: Map<string, string>,
  isOperation: boolean = false
): string | undefined {
  if (!targetName || photosMap.size === 0) return undefined;

  const targetKey = normalizeNameForMatching(targetName, isOperation);

  // 1. Busca exata pela chave normalizada
  if (photosMap.has(targetKey)) {
    return photosMap.get(targetKey);
  }

  // 2. Busca aproximada (inclusão/substring ou palavras-chave principais)
  for (const [key, photoUrl] of photosMap.entries()) {
    if (key === targetKey) return photoUrl;
    
    // Se uma contém a outra completamente
    if (key.length > 4 && targetKey.length > 4) {
      if (key.includes(targetKey) || targetKey.includes(key)) {
        return photoUrl;
      }
    }
  }

  return undefined;
}
