import React from "react";
import { Trophy, Medal, Sparkles } from "lucide-react";
import { RankedItem, MetricDefinition } from "../types";
import { AvatarPhoto } from "./AvatarPhoto";
import { triggerConfetti } from "../utils/confetti";
import { AssetChip } from "./stone-ds";

interface PodiumProps {
  items: RankedItem[];
  metric: MetricDefinition;
  isOperations: boolean;
}

type Place = 1 | 2 | 3;

const PLACES: Record<
  Place,
  {
    label: string;
    ring: "gold" | "silver" | "bronze";
    avatar: "xl" | "2xl";
    badge: string;
    medalBg: string;
    pedestal: string;
    pedestalLabel: string;
    pedestalText: string;
    order: string;
  }
> = {
  1: {
    label: "1º lugar campeão",
    ring: "gold",
    avatar: "2xl",
    badge: "bg-[#fbf3d4] text-[#7a5c00]",
    medalBg: "bg-[#d9a512] text-white",
    pedestal: "h-28 bg-q-green text-white",
    pedestalLabel: "Campeão",
    pedestalText: "text-white/80",
    order: "order-1 md:order-2",
  },
  2: {
    label: "2º lugar",
    ring: "silver",
    avatar: "xl",
    badge: "bg-white text-[#55555b]",
    medalBg: "bg-[#a9a9b1] text-white",
    pedestal: "h-20 q-stripes text-q-green-deep",
    pedestalLabel: "Prata",
    pedestalText: "text-q-green-deep/80",
    order: "order-2 md:order-1",
  },
  3: {
    label: "3º lugar",
    ring: "bronze",
    avatar: "xl",
    badge: "bg-white text-[#9a5330]",
    medalBg: "bg-[#c7794b] text-white",
    pedestal: "h-16 q-stripes text-q-green-deep",
    pedestalLabel: "Bronze",
    pedestalText: "text-q-green-deep/80",
    order: "order-3",
  },
};

const Pillar: React.FC<{
  place: Place;
  item?: RankedItem;
  metric: MetricDefinition;
  isOperations: boolean;
  onCelebrate: (e: React.MouseEvent<HTMLDivElement>) => void;
}> = ({ place, item, metric, isOperations, onCelebrate }) => {
  const cfg = PLACES[place];

  if (!item) {
    return (
      <div className={`${cfg.order} hidden items-center justify-center rounded-3xl bg-q-soft p-6 text-sm text-q-muted opacity-60 md:flex`}>
        {place}º lugar vago
      </div>
    );
  }

  const region = isOperations
    ? item.nome.includes("-")
      ? item.nome.split("-")[0].trim()
      : "Operação"
    : null;

  return (
    <div
      onClick={onCelebrate}
      className={`group cursor-pointer ${cfg.order} flex flex-col justify-end transition-transform duration-300 hover:-translate-y-1`}
    >
      <div
        className={`relative rounded-3xl p-5 text-center ${
          place === 1 ? "bg-q-green-tint" : "bg-q-soft"
        }`}
      >
        <span className="absolute right-4 top-4 text-q-muted/40 transition-colors group-hover:text-q-muted/70">
          {place === 1 ? <Trophy className="size-6" /> : <Medal className="size-5" />}
        </span>

        <span className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${cfg.badge}`}>
          {place === 1 && <Sparkles className="size-3" />}
          {cfg.label}
          {item.isTied && <span className="rounded-full bg-white/70 px-1.5 text-[10px]">Empate</span>}
        </span>

        <div className="mb-3 flex justify-center">
          <div className="relative">
            <AvatarPhoto
              src={item.photoUrl}
              name={item.nome}
              fallbackInitials={item.avatarFallback}
              size={cfg.avatar}
              medalRing={cfg.ring}
            />
            <span className={`absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border-2 border-white text-xs font-extrabold ${cfg.medalBg}`}>
              {place}
            </span>
          </div>
        </div>

        <h3 className="m-0 line-clamp-1 text-base font-extrabold text-q-ink sm:text-lg" title={item.nome}>
          {item.displayNome}
        </h3>
        {region && <span className="mb-1 block text-xs font-medium text-q-muted">{region}</span>}

        <div className="mt-3 rounded-2xl bg-white px-3 py-2.5">
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-q-muted">
            {place === 1 ? metric.label : metric.shortLabel}
          </span>
          <span className={`font-extrabold tracking-tight text-q-ink ${place === 1 ? "text-3xl" : "text-xl"}`}>
            {item.formattedValue}
          </span>
        </div>
      </div>

      {/* pedestal */}
      <div className={`mt-1.5 hidden flex-col items-center justify-center rounded-2xl md:flex ${cfg.pedestal}`}>
        <span className="text-2xl font-extrabold leading-none">{place}</span>
        <span className={`mt-0.5 text-[10px] font-semibold uppercase tracking-wider ${cfg.pedestalText}`}>
          {cfg.pedestalLabel}
        </span>
      </div>
    </div>
  );
};

export const Podium: React.FC<PodiumProps> = ({ items, metric, isOperations }) => {
  const [first, second, third] = items;

  if (!first) {
    return (
      <div className="rounded-q-card bg-q-card p-8 text-center text-sm text-q-muted">
        Nenhum dado disponível para exibir o pódio desta categoria.
      </div>
    );
  }

  const handleCelebrate = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerConfetti(
      (rect.left + rect.width / 2) / window.innerWidth,
      (rect.top + rect.height / 2) / window.innerHeight,
    );
  };

  return (
    <section className="rounded-q-card bg-q-card p-5 sm:p-6">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="m-0 text-lg font-extrabold tracking-tight text-q-ink sm:text-xl">
              Pódio dos Campeões
            </h2>
            <AssetChip label={metric.shortLabel} variant="success" />
          </div>
          <p className="m-0 mt-1 text-xs text-q-muted">{metric.description}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-q-soft px-3.5 py-1.5 text-xs font-medium text-q-muted sm:self-auto">
          <Sparkles className="size-3.5 text-q-green" />
          Clique nos cards para celebrar
        </span>
      </div>

      <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
        <Pillar place={2} item={second} metric={metric} isOperations={isOperations} onCelebrate={handleCelebrate} />
        <Pillar place={1} item={first} metric={metric} isOperations={isOperations} onCelebrate={handleCelebrate} />
        <Pillar place={3} item={third} metric={metric} isOperations={isOperations} onCelebrate={handleCelebrate} />
      </div>
    </section>
  );
};
