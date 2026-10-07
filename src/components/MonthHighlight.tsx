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

export const MonthHighlight: React.FC<MonthHighlightProps> = ({
  highlight,
  referenceMonth,
  isOperations,
}) => {
  if (!highlight) return null;

  const handleCelebrate = () => {
    triggerGoldenFireworks();
  };

  return (
    <div className="card mb-8 border-[#3a434d] hover:border-[#2d9d6e] bg-[#1a1f26] p-5 sm:p-6 transition-all duration-300">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Side: Avatar & Crown */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-[#2d9d6e] text-[#0f1419] p-1.5 rounded-full shadow-sm">
                <Crown className="w-4 h-4 fill-current" />
              </div>
            </div>
            <AvatarPhoto
              src={highlight.photoUrl}
              name={highlight.nome}
              fallbackInitials={highlight.avatarFallback}
              size="2xl"
              medalRing="gold"
              className="mt-1"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#2d9d6e]/15 border border-[#2d9d6e]/30 text-[#2d9d6e] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-[#2d9d6e]" />
              <span>Destaque do Mês • {referenceMonth}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#e8e8e8] tracking-tight m-0">
              {highlight.displayNome}
            </h2>

            {isOperations && (
              <p className="text-xs text-[#808080] font-normal mt-0.5 mb-1">
                {highlight.nome}
              </p>
            )}

            <p className="text-sm text-[#b0b0b0] font-normal max-w-md mt-1 mb-0">
              {highlight.summaryNote}
            </p>
          </div>
        </div>

        {/* Center / Right: Podiums Count & Achievements */}
        <div className="flex flex-col items-center lg:items-end gap-3.5 w-full lg:w-auto">
          {/* Stats Bar */}
          <div className="flex items-center gap-3 bg-[#242b33] border border-[#3a434d] rounded-[6px] p-2.5 px-4 shadow-sm">
            <div className="text-center px-2">
              <span className="text-xl font-bold text-[#2d9d6e] block">
                {highlight.totalPodiums}
              </span>
              <span className="text-[10px] uppercase text-[#808080] font-medium tracking-wider">
                Pódios Totais
              </span>
            </div>
            <div className="h-6 w-px bg-[#3a434d]" />
            <div className="text-center px-2">
              <span className="text-xl font-bold text-[#d4af37] block">
                {highlight.firstPlaceCount}
              </span>
              <span className="text-[10px] uppercase text-[#808080] font-medium tracking-wider">
                1º Lugares
              </span>
            </div>
            <div className="h-6 w-px bg-[#3a434d]" />
            <div className="text-center px-2">
              <span className="text-xl font-bold text-[#b0b0b0] block">
                {highlight.secondPlaceCount}
              </span>
              <span className="text-[10px] uppercase text-[#808080] font-medium tracking-wider">
                2º Lugares
              </span>
            </div>
            <div className="h-6 w-px bg-[#3a434d]" />
            <div className="text-center px-2">
              <span className="text-xl font-bold text-[#c87d55] block">
                {highlight.thirdPlaceCount}
              </span>
              <span className="text-[10px] uppercase text-[#808080] font-medium tracking-wider">
                3º Lugares
              </span>
            </div>
          </div>

          {/* Medals List */}
          <div className="flex flex-wrap justify-center lg:justify-end gap-1.5 max-w-md">
            {highlight.appearances.map((app, idx) => {
              let medalIcon = "🥇";
              let variantType: "warning" | "silver" | "bronze" = "warning";
              if (app.rank === 2) {
                medalIcon = "🥈";
                variantType = "silver";
              } else if (app.rank === 3) {
                medalIcon = "🥉";
                variantType = "bronze";
              }

              return (
                <AssetChip
                  key={idx}
                  icon={<span>{medalIcon}</span>}
                  label={`${app.rank}º em ${app.categoryLabel}:`}
                  value={app.valueFormatted}
                  variant={variantType}
                />
              );
            })}
          </div>

          {/* Celebrate Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleCelebrate}
            className="gap-2 text-xs font-semibold mt-1"
          >
            <PartyPopper className="w-3.5 h-3.5" />
            <span>Celebrar Reconhecimento</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
