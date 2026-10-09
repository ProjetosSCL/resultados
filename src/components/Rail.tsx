import React from "react";
import {
  Headphones,
  Timer,
  Clock,
  ScrollText,
  Workflow,
  Maximize2,
  Minimize2,
  Settings,
  Tv,
  type LucideIcon,
} from "lucide-react";
import { MetricDefinition, MetricKey } from "../types";

interface RailProps {
  metrics: MetricDefinition[];
  activeMetricKey: MetricKey;
  onMetricSelect: (key: MetricKey) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenSettings: () => void;
  onStartPresentation?: () => void;
}

const METRIC_ICONS: Record<MetricKey, LucideIcon> = {
  CHAMADOS: Headphones,
  TMA_STONE: Timer,
  TMA_TON: Clock,
  TMA_BOBINA: ScrollText,
  CICLO_TRIAGEM: Workflow,
};

interface RailButtonProps {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const RailButton: React.FC<RailButtonProps> = ({ label, active, onClick, children }) => (
  <div className="group relative">
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`grid size-10 cursor-pointer lg:size-11 place-items-center rounded-full transition-colors ${
        active
          ? "bg-q-green text-white"
          : "text-q-muted hover:bg-q-soft hover:text-q-ink"
      }`}
    >
      {children}
    </button>
    {/* rótulo ao passar o mouse (desktop) */}
    <span className="pointer-events-none absolute left-full top-1/2 z-30 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-q-ink px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 lg:block">
      {label}
    </span>
  </div>
);

/**
 * Rail lateral: grupo 1 seleciona a métrica ativa; grupo 2 reúne
 * tela cheia e configuração da planilha. No mobile vira uma barra horizontal.
 */
export const Rail: React.FC<RailProps> = ({
  metrics,
  activeMetricKey,
  onMetricSelect,
  isFullscreen,
  onToggleFullscreen,
  onOpenSettings,
  onStartPresentation,
}) => {
  const group =
    "flex items-center gap-1 rounded-full bg-q-card p-1.5 lg:flex-col lg:gap-1.5 lg:p-2";

  return (
    <aside
      aria-label="Métricas e ações"
      className="flex shrink-0 items-center justify-between gap-3 overflow-x-auto lg:sticky lg:top-6 lg:min-h-[28rem] lg:flex-col lg:items-center lg:justify-between lg:self-start lg:overflow-visible"
    >
      <div className={group}>
        {metrics.map((metric) => {
          const Icon = METRIC_ICONS[metric.key];
          return (
            <RailButton
              key={metric.key}
              label={metric.shortLabel}
              active={metric.key === activeMetricKey}
              onClick={() => onMetricSelect(metric.key)}
            >
              <Icon className="size-5" strokeWidth={2.1} />
            </RailButton>
          );
        })}
      </div>

      <div className={group}>
        {onStartPresentation && (
          <RailButton
            label="Modo Apresentação (Reunião)"
            onClick={onStartPresentation}
          >
            <Tv className="size-5 text-q-green" strokeWidth={2.1} />
          </RailButton>
        )}
        <RailButton
          label={isFullscreen ? "Sair da tela cheia" : "Modo reunião (tela cheia)"}
          active={isFullscreen}
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="size-5" strokeWidth={2.1} />
          ) : (
            <Maximize2 className="size-5" strokeWidth={2.1} />
          )}
        </RailButton>
        <RailButton label="Configurar planilha" onClick={onOpenSettings}>
          <Settings className="size-5" strokeWidth={2.1} />
        </RailButton>
      </div>
    </aside>
  );
};
