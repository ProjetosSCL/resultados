import { MetricDefinition, MetricKey } from "../types";
import { UNIDADE } from "../config";

export const METRICS: MetricDefinition[] = [
  {
    key: "CHAMADOS",
    label: "Chamados Concluídos",
    shortLabel: "Chamados",
    description: "Volume total de chamados atendidos (Maior é melhor)",
    direction: "higher_is_better",
    unit: " chamados",
  },
  {
    key: "TMA_STONE",
    label: "TMA Stone",
    shortLabel: "TMA Stone",
    description: "Tempo Médio de Atendimento Stone (Menor é melhor)",
    direction: "lower_is_better",
    isTime: true,
    unit: UNIDADE,
  },
  {
    key: "TMA_TON",
    label: "TMA TON",
    shortLabel: "TMA TON",
    description: "Tempo Médio de Atendimento TON (Menor é melhor)",
    direction: "lower_is_better",
    isTime: true,
    unit: UNIDADE,
  },
  {
    key: "TMA_BOBINA",
    label: "TMA Bobina",
    shortLabel: "TMA Bobina",
    description: "Tempo Médio de Atendimento Bobina (Menor é melhor)",
    direction: "lower_is_better",
    isTime: true,
    unit: UNIDADE,
  },
  {
    key: "CICLO_TRIAGEM",
    label: "Ciclo de Triagem",
    shortLabel: "Ciclo Triagem",
    description: "Tempo médio do ciclo de triagem (Menor é melhor)",
    direction: "lower_is_better",
    isTime: true,
    unit: UNIDADE,
    operationsOnly: true,
  },
];

export function getMetricsForView(isOperations: boolean): MetricDefinition[] {
  if (isOperations) {
    return METRICS;
  }
  return METRICS.filter((m) => !m.operationsOnly);
}

export function formatMetricValue(value: number, metric: MetricDefinition, customUnit: string = UNIDADE): string {
  if (metric.key === "CHAMADOS") {
    return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(value);
  }
  
  // Format with decimal comma, e.g. "0,49"
  const formatted = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  const unit = metric.unit !== undefined ? metric.unit : customUnit;
  return `${formatted}${unit}`;
}
