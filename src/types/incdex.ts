export type ViewMode = "OPERACOES" | "ANGELS";

export type MetricKey = "CHAMADOS" | "TMA_STONE" | "TMA_TON" | "TMA_BOBINA" | "CICLO_TRIAGEM";

export interface MetricDefinition {
  key: MetricKey;
  label: string;
  shortLabel: string;
  description: string;
  direction: "higher_is_better" | "lower_is_better";
  isTime?: boolean;
  unit?: string;
  operationsOnly?: boolean;
}

export interface OperationRow {
  nome: string;
  chamados: number;
  tmaStone: number;
  tmaTon: number;
  tmaBobina: number;
  cicloTriagem: number;
  raw: Record<string, string>;
}

export interface AngelRow {
  nome: string;
  chamados: number;
  tmaStone: number;
  tmaTon: number;
  tmaBobina: number;
  raw: Record<string, string>;
}

export interface PhotoRow {
  nome: string;
  link: string;
  driveThumbnailUrl?: string;
}

export interface RankedItem {
  id: string;
  nome: string;
  displayNome: string;
  rank: number;
  value: number;
  formattedValue: string;
  photoUrl?: string;
  avatarFallback: string;
  isTied: boolean;
  deltaFromLeader?: number;
  metricKey: MetricKey;
}

export interface HighlightPodiumAppearance {
  categoryKey: MetricKey;
  categoryLabel: string;
  rank: number;
  valueFormatted: string;
}

export interface MonthHighlightData {
  nome: string;
  displayNome: string;
  photoUrl?: string;
  avatarFallback: string;
  totalPodiums: number;
  firstPlaceCount: number;
  secondPlaceCount: number;
  thirdPlaceCount: number;
  score: number;
  appearances: HighlightPodiumAppearance[];
  summaryNote: string;
}

export interface SheetFetchStatus {
  operacoes: "idle" | "loading" | "success" | "error";
  angels: "idle" | "loading" | "success" | "error";
  fotos: "idle" | "loading" | "success" | "error";
  errorMessage?: string;
  lastUpdated?: Date;
  isUsingSampleData?: boolean;
}
