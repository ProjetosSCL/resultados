import React from "react";
import { Crown, Sparkles, PartyPopper } from "lucide-react";
import { MonthHighlightData } from "../types";
import { AvatarPhoto } from "./AvatarPhoto";
import { triggerGoldenFireworks } from "../utils/confetti";
import { Button, AssetChip } from "./stone-ds";

interface MonthHighlightProps {
  highlight: MonthHighlightData | null;
  referenceMonth: string;
  isOperations: boolean;
}

const MEDAL_COUNTERS = [
  { key: "firstPlaceCount", label: "1º", color: "#E9B824" },
  { key: "secondPlaceCount", label: "2º", color: "#D8D8DD" },
  { key: "thirdPlaceCount", label: "3º", color: "#D98A5B" },
] as const;

/**
 * Destaque do Mês — cartão verde (equivalente ao cartão Visa do mock).
 */
export const MonthHighlight: React.FC<MonthHighlightProps> = ({
  highlight,
  referenceMonth,
  isOperations,
}) => {
  if (!highlight) return null;

  return (
    <section className="relative h-full overflow-hidden rounded-q-card bg-q-green p-6 text-white sm:p-7">
      {/* decoração sutil */}
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-white/10" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 right-28 size-60 rounded-full bg-white/5" />

      <div className="relative flex h-full flex-col gap-6">
        {/* topo */}
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold">
            <Sparkles className="size-3.5" />
            Destaque do Mês • {referenceMonth}
          </span>
          <span className="grid size-9 place-items-center rounded-full bg-white/15">
            <Crown className="size-4 fill-current" />
          </span>
        </div>

        {/* identidade */}
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <AvatarPhoto
            src={highlight.photoUrl}
            name={highlight.nome}
            fallbackInitials={highlight.avatarFallback}
            size="2xl"
            medalRing="gold"
          />
          <div className="min-w-0">
            <h2 className="m-0 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {highlight.displayNome}
            </h2>
            {isOperations && (
              <p className="m-0 mt-0.5 text-xs font-medium text-white/70">{highlight.nome}</p>
            )}
            <p className="m-0 mt-2 max-w-md text-sm text-white/85">{highlight.summaryNote}</p>
          </div>
        </div>

        {/* números + ação */}
        <div className="mt-auto flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <div>
              <span className="block text-5xl font-extrabold leading-none tracking-tight">
                {highlight.totalPodiums}
              </span>
              <span className="mt-1 block text-xs font-medium text-white/75">pódios totais</span>
            </div>
            <div className="flex items-center gap-2 pb-0.5">
              {MEDAL_COUNTERS.map(({ key, label, color }) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 py-1 pl-1.5 pr-3 text-xs font-bold"
                >
                  <span
                    className="grid size-5 place-items-center rounded-full text-[10px] font-extrabold text-q-ink"
                    style={{ backgroundColor: color }}
                  >
                    {label}
                  </span>
                  {highlight[key]}
                </span>
              ))}
            </div>
          </div>

          <Button variant="onGreen" size="sm" onClick={() => triggerGoldenFireworks()}>
            <PartyPopper className="size-4" />
            Celebrar reconhecimento
          </Button>
        </div>

        {/* medalhas por categoria */}
        {highlight.appearances.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {highlight.appearances.map((app, idx) => {
              const medal = app.rank === 1 ? "🥇" : app.rank === 2 ? "🥈" : "🥉";
              return (
                <AssetChip
                  key={idx}
                  variant="onGreen"
                  icon={<span>{medal}</span>}
                  label={`${app.rank}º em ${app.categoryLabel}:`}
                  value={app.valueFormatted}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
